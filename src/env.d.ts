/// <reference types="astro/client" />

interface Window {
  htq: ((...args: unknown[]) => void) & { q?: unknown[][] };
}
