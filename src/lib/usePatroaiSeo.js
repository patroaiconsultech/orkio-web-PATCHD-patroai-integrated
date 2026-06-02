import { useEffect } from "react";

const SEO = {
  en: {
    title: "PatroAI — AI Infrastructure, Vertical Ventures & Business Execution",
    description:
      "PatroAI builds AI-driven startups, on-demand vertical ventures and intelligent business operations with strategy, integrations, governance, ESG and fast, secure execution.",
    canonical: "https://patroai.com/",
    logo: "https://patroai.com/patroai-assets/logo-patroai-novo.png",
    lang: "en",
    locale: "en_US",
  },
  pt: {
    title: "PatroAI — IA, Verticais Inteligentes e Execução Empresarial",
    description:
      "A PatroAI cria startups, verticais inteligentes e operações com IA para empresas, integrando sistemas, dados, governança, ESG e execução rápida, segura e eficiente.",
    canonical: "https://patroai.com.br/",
    logo: "https://patroai.com.br/patroai-assets/logo-patroai-novo.png",
    lang: "pt-BR",
    locale: "pt_BR",
  },
};

function getSeo() {
  if (typeof window === "undefined") return SEO.en;

  const host = String(window.location.hostname || "").toLowerCase();
  if (host.includes("patroai.com.br")) return SEO.pt;

  return SEO.en;
}

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("link");
    document.head.appendChild(el);
  }

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function upsertJsonLd(id, payload) {
  let el = document.head.querySelector(`script[data-seo-id="${id}"]`);

  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(payload);
}

function applyPatroaiSeo() {
  if (typeof document === "undefined") return;

  const seo = getSeo();

  document.documentElement.setAttribute("lang", seo.lang);
  document.title = seo.title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: seo.description,
  });

  upsertLink('link[rel="canonical"]', {
    rel: "canonical",
    href: seo.canonical,
  });

  upsertLink('link[rel="alternate"][hreflang="en"]', {
    rel: "alternate",
    hreflang: "en",
    href: "https://patroai.com/",
  });

  upsertLink('link[rel="alternate"][hreflang="pt-BR"]', {
    rel: "alternate",
    hreflang: "pt-BR",
    href: "https://patroai.com.br/",
  });

  upsertLink('link[rel="alternate"][hreflang="x-default"]', {
    rel: "alternate",
    hreflang: "x-default",
    href: "https://patroai.com/",
  });

  upsertLink('link[rel="icon"][data-patroai-brand="true"]', {
    rel: "icon",
    type: "image/png",
    href: "/patroai-assets/logo-patroai-novo.png",
    "data-patroai-brand": "true",
  });

  upsertLink('link[rel="apple-touch-icon"]', {
    rel: "apple-touch-icon",
    href: "/patroai-assets/logo-patroai-novo.png",
  });

  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: seo.title,
  });

  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: seo.description,
  });

  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: seo.canonical,
  });

  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "website",
  });

  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: "PatroAI",
  });

  upsertMeta('meta[property="og:locale"]', {
    property: "og:locale",
    content: seo.locale,
  });

  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: seo.logo,
  });

  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });

  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: seo.title,
  });

  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: seo.description,
  });

  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: seo.logo,
  });

  upsertJsonLd("patroai-organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PatroAI Consultech",
    alternateName: "PatroAI",
    url: seo.canonical,
    logo: seo.logo,
    description: seo.description,
  });

  upsertJsonLd("patroai-website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PatroAI",
    url: seo.canonical,
    description: seo.description,
    inLanguage: seo.lang,
  });
}

export default function usePatroaiSeo() {
  useEffect(() => {
    applyPatroaiSeo();
  }, []);
}
