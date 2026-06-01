import { useEffect } from "react";

const SEO = {
  en: {
    title: "PatroAI Consultech — Startup outsourcing, AI and investor-grade governance",
    description: "PatroAI develops startups and digital operations through a premium outsourcing model, combining business plans, financial feasibility studies, technology development, SaaS, AI, governance, and traceability for companies, investors, and stakeholders.",
    canonical: "https://www.patroai.com/",
    logo: "https://www.patroai.com/patroai-assets/logo-patroai.png",
    lang: "en"
  },
  pt: {
    title: "PatroAI Consultech — Startup outsourcing, IA e governança para investidores",
    description: "A PatroAI desenvolve startups e operações digitais em modelo outsourcing premium, com business plan, viabilidade econômico-financeira, tecnologia, SaaS, IA, governança e rastreabilidade para empresas, investidores e stakeholders.",
    canonical: "https://www.patroai.com.br/",
    logo: "https://www.patroai.com.br/patroai-assets/logo-patroai.png",
    lang: "pt-BR"
  }
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
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
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

export function applyPatroaiSeoIdentity() {
  if (typeof document === "undefined") return;

  const seo = getSeo();
  document.documentElement.setAttribute("lang", seo.lang);
  document.title = seo.title;

  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });

  upsertLink('link[rel="canonical"]', { rel: "canonical", href: seo.canonical });
  upsertLink('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: "https://www.patroai.com/" });
  upsertLink('link[rel="alternate"][hreflang="pt-BR"]', { rel: "alternate", hreflang: "pt-BR", href: "https://www.patroai.com.br/" });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: "https://www.patroai.com/" });

  upsertLink('link[rel="icon"][sizes="any"]', { rel: "icon", href: "/favicon.ico", sizes: "any" });
  upsertLink('link[rel="icon"][sizes="48x48"]', { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" });
  upsertLink('link[rel="icon"][sizes="192x192"]', { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192x192.png" });
  upsertLink('link[rel="apple-touch-icon"]', { rel: "apple-touch-icon", href: "/apple-touch-icon.png" });

  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: seo.canonical });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: seo.logo });

  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: seo.logo });

  upsertJsonLd("patroai-organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PatroAI Consultech",
    "alternateName": "PatroAI",
    "url": seo.canonical,
    "logo": seo.logo,
    "description": seo.description,
    "sameAs": []
  });
}

export default function usePatroaiSeo() {
  useEffect(() => {
    applyPatroaiSeoIdentity();
  }, []);
}
