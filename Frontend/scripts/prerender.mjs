// Build-time prerender. Runs after `vite build` (client) and `vite build --ssr` (server bundle).
// For every public route it renders the React app to static HTML, injects it into the client
// template and writes one HTML file per route, plus dist/sitemap.xml. No headless browser.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_URL = "https://www.qrgratis.es";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const serverEntry = join(root, "dist-server", "entry-server.js");
const templatePath = join(distDir, "index.html");

function fail(message) {
  console.error(`\n[prerender] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(templatePath)) fail(`Missing ${templatePath}. Run "vite build" first.`);
if (!existsSync(serverEntry)) fail(`Missing ${serverEntry}. Run "vite build --ssr src/entry-server.tsx --outDir dist-server" first.`);

const template = readFileSync(templatePath, "utf8");
const ROOT_PLACEHOLDER = '<div id="root"></div>';
if (!template.includes(ROOT_PLACEHOLDER)) fail(`Template has no ${ROOT_PLACEHOLDER} placeholder.`);

// Head tags that the page-level Helmet output replaces (avoids duplicates).
const DEFAULT_HEAD_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/gi,
  /<meta\s+name="description"[^>]*>\s*/gi,
  /<meta\s+name="keywords"[^>]*>\s*/gi,
  /<meta\s+property="og:[^"]*"[^>]*>\s*/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
];

function stripDefaultHead(html) {
  return DEFAULT_HEAD_TAGS.reduce((acc, pattern) => acc.replace(pattern, ""), html);
}

function buildPage(html, head) {
  const stripped = stripDefaultHead(template);
  if (!stripped.includes("</head>")) fail("Template has no </head>.");
  return stripped
    .replace("</head>", () => `    ${head}\n  </head>`)
    .replace(ROOT_PLACEHOLDER, () => `<div id="root">${html}</div>`);
}

function outputPathFor(route) {
  return route === "/" ? templatePath : join(distDir, `${route.replace(/^\//, "")}.html`);
}

function count(haystack, pattern) {
  return (haystack.match(pattern) ?? []).length;
}

function validate(route, page) {
  const problems = [];
  if (!/<h1[\s>]/i.test(page)) problems.push("no <h1>");
  if (count(page, /<link[^>]+rel="canonical"/gi) !== 1) problems.push("missing or duplicated canonical");
  if (count(page, /<title[\s>]/gi) !== 1) problems.push("missing or duplicated <title>");
  if (count(page, /<meta[^>]+name="description"/gi) !== 1) problems.push("missing or duplicated meta description");
  const canonical = page.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  const expected = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  if (canonical && canonical !== expected) problems.push(`canonical is ${canonical}, expected ${expected}`);
  return problems;
}

function priorityFor(route) {
  if (route === "/") return "1.0";
  if (route.startsWith("/generador-qr/")) return "0.9";
  if (route === "/faq") return "0.7";
  if (route === "/about") return "0.5";
  if (route === "/donaciones") return "0.4";
  return "0.3"; // legal pages
}

function buildSitemap(routes) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((route) => {
      const loc = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <priority>${priorityFor(route)}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const { render, PRERENDER_ROUTES } = await import(pathToFileURL(serverEntry).href);

// Keep the untouched client template as the SPA fallback for client-only routes (e.g. /history),
// so they do not boot with the home page's prerendered markup and canonical.
writeFileSync(join(distDir, "app-shell.html"), template);

const errors = [];
const seenTitles = new Map();
const written = [];

for (const route of PRERENDER_ROUTES) {
  let result;
  try {
    result = await render(route);
  } catch (error) {
    errors.push(`${route}: render failed: ${error instanceof Error ? error.stack ?? error.message : error}`);
    continue;
  }

  const page = buildPage(result.html, result.head);
  const problems = validate(route, page);
  const title = page.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  if (title) {
    if (seenTitles.has(title)) problems.push(`duplicate <title> with ${seenTitles.get(title)}`);
    else seenTitles.set(title, route);
  }
  if (problems.length > 0) {
    errors.push(`${route}: ${problems.join("; ")}`);
    continue;
  }

  const file = outputPathFor(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  written.push(file);
  console.log(`[prerender] ${route.padEnd(24)} -> ${file.slice(root.length + 1)}`);
}

if (errors.length > 0) fail(`\n  ${errors.join("\n  ")}`);

writeFileSync(join(distDir, "sitemap.xml"), buildSitemap(PRERENDER_ROUTES));
console.log(`[prerender] sitemap.xml with ${PRERENDER_ROUTES.length} URLs`);

console.log(`[prerender] done: ${written.length} pages`);
