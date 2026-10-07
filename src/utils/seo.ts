import { SITE } from "../config";

export interface SeoInput {
  title: string; // full <title>, already composed (keyword first, brand last)
  description: string; // ≤160 chars
  path: string; // e.g. '/tools/crop-profit-calculator/'
  noindex?: boolean;
  breadcrumbs?: { name: string; path?: string }[]; // last item = current page
  webApp?: { name: string; description: string }; // WebApplication JSON-LD for tool pages
  article?: {
    headline: string;
    datePublished: string;
    dateModified: string;
    authorName: string;
  };
}

const trimSlash = (p: string) =>
  p === "/" ? "/" : p.replace(/\/+$/, "") + "/";

export function canonical(path: string): string {
  return SITE.url + trimSlash(path);
}

export function seoJsonLd(input: SeoInput): string {
  const graph: object[] = [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/favicon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@harvesttowncalc.top",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: `${SITE.url}/`,
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ];

  if (input.breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: input.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        ...(b.path ? { item: canonical(b.path) } : {}),
      })),
    });
  }

  if (input.webApp) {
    graph.push({
      "@type": "WebApplication",
      "@id": canonical(input.path) + "#app",
      name: input.webApp.name,
      url: canonical(input.path),
      description: input.webApp.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE.url}/#organization` },
    });
  }

  if (input.article) {
    graph.push({
      "@type": "Article",
      headline: input.article.headline,
      datePublished: input.article.datePublished,
      dateModified: input.article.dateModified,
      author: {
        "@type": "Person",
        name: input.article.authorName,
        url: `${SITE.url}/about/`,
      },
      publisher: { "@id": `${SITE.url}/#organization` },
      mainEntityOfPage: canonical(input.path),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
