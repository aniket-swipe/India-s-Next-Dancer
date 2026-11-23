/**
 * Build-time prerender: writes real HTML (content, links, meta, JSON-LD) for every route,
 * plus 404.html, sitemap.xml and robots.txt. Run after `vite build` + the SSR build.
 *
 *   SITE_ENV=staging npm run build   -> every page noindex + robots.txt disallows all
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const staging = process.env.SITE_ENV === 'staging'

const { render, headTags, PAGES, SITE } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const page = (route, { noindex } = {}) =>
  template
    .replace('<!--head-->', headTags(route, { noindex }))
    .replace('<!--app-->', render(route))

// 1) one HTML file per indexable route: /about/ -> dist/about/index.html
for (const route of Object.keys(PAGES)) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page(route, { noindex: staging }))
  console.log('prerendered', route)
}

// 2) custom 404 (host must serve it with HTTP 404 — see deploy notes)
fs.writeFileSync(path.join(dist, '404.html'), page('/__not-found__/', { noindex: true }))
console.log('prerendered 404.html')

// 3) sitemap.xml — canonical, indexable, 200-status URLs only
const today = new Date().toISOString().slice(0, 10)
const prio = { '/': '1.0', '/about/': '0.7', '/privacy-policy/': '0.3', '/terms-and-conditions/': '0.3' }
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(PAGES).map(r => `  <url>
    <loc>${SITE.url}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${prio[r] ?? '0.5'}</priority>
  </url>`).join('\n')}
</urlset>
`
if (!staging) fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)

// 4) robots.txt — staging builds block everything
if (staging) fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(staging ? 'STAGING build: noindex everywhere' : 'production build ready')
