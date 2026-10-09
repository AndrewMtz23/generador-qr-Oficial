import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";
import i18n from "./i18n/config";

/** Public routes that are prerendered to static HTML at build time. `/history` is client-only. */
export const PRERENDER_ROUTES: string[] = [
  "/",
  "/generador-qr/url",
  "/generador-qr/whatsapp",
  "/generador-qr/wifi",
  "/generador-qr/texto",
  "/faq",
  "/about",
  "/donaciones",
  "/terms",
  "/privacy",
  "/cookies",
];

export interface RenderResult {
  /** Markup to inject inside `<div id="root">`. */
  html: string;
  /** Helmet-managed head tags (title, meta, link, script). */
  head: string;
}

/**
 * Renders one route to static HTML. Uses the streaming renderer and waits for
 * `onAllReady` so React.lazy pages are fully resolved (renderToString would
 * emit the Suspense fallback instead).
 */
export async function render(url: string): Promise<RenderResult> {
  await i18n.changeLanguage("es");

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = await new Promise<string>((resolve, reject) => {
    const decoder = new TextDecoder();
    let output = "";

    const sink = new Writable({
      write(chunk: string | Uint8Array, _encoding: string, callback: (error?: Error | null) => void) {
        output += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
        callback();
      },
      final(callback: (error?: Error | null) => void) {
        output += decoder.decode();
        resolve(output);
        callback();
      },
    });

    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          pipe(sink);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          reject(error);
        },
      }
    );
  });

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script]
        .map((tag) => tag.toString())
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { html, head };
}
