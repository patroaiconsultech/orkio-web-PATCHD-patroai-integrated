## 1. Diagnóstico principal

A causa raiz mais provável é **combinação de auth/session inconsistente + tratamento incorreto do erro no chat**.

O erro “Falha ao avaliar capability operacional solicitada.” não deve ser exibido quando o backend retorna `401 Unauthorized`. Esse texto pertence ao domínio de **runtime/capability**, não ao domínio de **autenticação**.

### Separação causa x sintoma

**Causa raiz operacional:**

* O frontend ou camada de fallback do chat está tratando falha HTTP `401` como se fosse falha semântica de capability.

**Sintoma:**

* O usuário vê “Falha ao avaliar capability operacional solicitada.”

**Evento real nos logs:**

* `/api/chat/stream` retornou `401`.
* fallback `/api/chat` também retornou `401`.
* depois login, heartbeat, `/api/me`, `/api/threads`, `/api/messages` e `/api/chat/stream` voltaram a `200`. 

Isso prova que houve falha real de sessão/token no início do ciclo, mas não prova falha real de capability naquele momento.

---

## 2. Evidências técnicas

### O que os logs provam

Os logs mostram sequência clara:

```txt
OPTIONS /api/chat/stream 200
POST /api/chat/stream 401 Unauthorized
OPTIONS /api/chat 200
POST /api/chat 401 Unauthorized
...
POST /api/auth/login 200
POST /api/auth/heartbeat 200
GET /api/me 200
...
POST /api/chat/stream 200
```

Isso prova:

1. CORS/preflight estava OK.
2. A requisição real falhou por auth.
3. O fallback não-stream também falhou por auth.
4. A sessão voltou após login/heartbeat.
5. O serviço backend estava vivo. 

### O que os logs não provam

Não provam que:

* `capability_registry` falhou.
* `intent_engine` escolheu capability errada naquele ciclo.
* `squad_resolve_readonly` foi acionado.
* houve `CONSTRAINT_VIOLATION`.
* o backend executou `_execute_capability_if_authorized`.

Para provar falha real de capability, seria necessário log com:

```txt
capability_name=...
requires_runtime_execution=True
_execute_capability_if_authorized
CAPABILITY_ERROR
```

### Como distinguir auth de capability

**Falha auth:**

```txt
HTTP 401
/api/chat/stream
/api/chat
```

Resposta correta ao usuário:

```txt
Sessão expirada. Faça login novamente.
```

**Falha capability:**

```txt
HTTP 200 ou 500 após usuário autenticado
intent_package.requires_runtime_execution=True
capability_name definido
erro dentro de executor/capability
```

Resposta correta:

```txt
Falha ao avaliar capability operacional solicitada.
```

---

## 3. Pontos exatos a auditar

### Backend

Arquivos prováveis:

* `app/main.py`
* `app/security.py`
* `app/routes/user.py`
* `app/runtime/intent_engine.py`
* `app/runtime/capability_registry.py`

Funções prováveis:

* rota `POST /api/chat`
* rota `POST /api/chat/stream`
* `decode_token`
* `require_secret` / dependência auth equivalente
* `_execute_capability_if_authorized`
* `_should_execute_runtime_from_enrichment`

Auditar se `401` é lançado antes de qualquer capability. Se sim, não pode virar erro semântico.

### Frontend

Arquivos prováveis:

* `src/ui/api.js`
* `src/routes/AppConsole.jsx`

Funções prováveis:

* `sendMessage`
* chamada de stream
* fallback para `/api/chat`
* tratamento de erro HTTP
* handler de SSE/error

Auditar se existe algo como:

```js
catch {
  show("Falha ao avaliar capability operacional solicitada.")
}
```

ou se qualquer erro genérico do chat vira mensagem de capability.

### Fluxo `/api/chat/stream`

Verificar:

1. token enviado no header.
2. token ausente/expirado retorna `401`.
3. frontend intercepta `401`.
4. não tenta fallback `/api/chat` com token inválido sem antes renovar sessão.

### Fluxo `/api/chat`

Verificar:

1. não mascarar `401`.
2. não criar mensagem assistant com texto de capability quando status é `401`.

### Auth/heartbeat/session

Verificar:

* armazenamento do token.
* refresh após deploy/reload.
* corrida entre heartbeat e envio de chat.
* envio de chat antes de `/api/me` confirmar sessão válida.

### Tratamento de erro no chat

Regra esperada:

```txt
401 → sessão expirada
402 → wallet/saldo
403 → permissão
422 → payload inválido
5xx → erro backend
capability error → só quando backend retornar erro de capability autenticado
```

---

## 4. Hipóteses priorizadas

### CRÍTICO

**Frontend mascarando `401` como falha de capability.**
Melhor explicação para o conjunto: houve `401` real e mensagem errada ao usuário.

### ALTO

**Sessão/token fica inconsistente após deploy, reload ou heartbeat.**
Os logs mostram chat falhando antes do login/heartbeat voltar a `200`.

### ALTO

**Fallback stream → non-stream reutiliza sessão inválida e duplica erro.**
`/api/chat/stream` deu `401`; logo depois `/api/chat` também deu `401`.

### MÉDIO

**Backend devolve detalhe semântico errado em exceção genérica.**
Possível se `main.py` captura exceção ampla e retorna texto fixo de capability.

### BAIXO

**Capability real falhando nesse ciclo específico.**
Os logs apresentados não sustentam isso. Para esse ciclo, a evidência primária é auth.

---

## 5. Patch mínimo recomendado

### Ordem

1. **Frontend primeiro**

   * `src/ui/api.js`
   * `src/routes/AppConsole.jsx`

Implementar classificação explícita:

```js
if (response.status === 401) {
  throw new AuthExpiredError("Sessão expirada. Faça login novamente.");
}
```

No chat:

```js
if (error instanceof AuthExpiredError) {
  showSessionExpired();
  stopFallback();
  return;
}
```

Regra: **não executar fallback `/api/chat` se `/api/chat/stream` retornou 401**.

2. **Backend**

   * `app/main.py`

Garantir que erro de capability só seja usado dentro de bloco autenticado e após decisão runtime.

```py
except HTTPException as e:
    raise e
```

Antes de qualquer:

```py
except Exception:
    return "Falha ao avaliar capability operacional solicitada."
```

3. **Observabilidade**
   Logar:

```txt
CHAT_AUTH_FAILED route=/api/chat/stream status=401
CHAT_STREAM_FALLBACK_BLOCKED reason=auth_failed
CHAT_CAPABILITY_ERROR capability_name=...
```

---

## 6. Validação

### Teste 1 — token ausente

Enviar `/api/chat/stream` sem token.

Esperado:

```txt
HTTP 401
UI: Sessão expirada
Não exibir falha de capability
Não chamar /api/chat fallback
```

### Teste 2 — token expirado

Usar token inválido.

Esperado igual ao teste 1.

### Teste 3 — sessão válida

Login → `/api/me` 200 → `/api/chat/stream`.

Esperado:

```txt
200 OK
resposta normal
```

### Teste 4 — capability real quebrada

Com sessão válida, forçar uma capability inexistente.

Esperado:

```txt
erro de capability
sem 401
log com capability_name
```

### Teste 5 — fallback stream

Simular falha de rede `5xx` no stream.

Esperado:

```txt
fallback /api/chat permitido
```

Simular `401` no stream.

Esperado:

```txt
fallback bloqueado
```

## Conclusão

O problema específico descrito é principalmente **auth/session + tratamento incorreto de erro no frontend/chat**.

A mensagem “Falha ao avaliar capability operacional solicitada.” está sendo usada em contexto errado. Para o ciclo evidenciado pelos logs, o erro correto deveria ser **sessão expirada ou autenticação inválida**, não falha de capability.
