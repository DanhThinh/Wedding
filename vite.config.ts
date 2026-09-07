import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { createWeddingMetadata } from './src/lib/metadata'

function normalizeBasePath(value: string | undefined) {
  const basePath = value?.trim() || '/'
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function weddingHtml(siteUrl?: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'wedding-html',
    configResolved(config) { outDir = resolve(config.root, config.build.outDir) },
    transformIndexHtml(html) {
      return html.replace('<!-- WEDDING_METADATA -->', createWeddingMetadata(siteUrl || undefined))
    },
    closeBundle() {
      // GitHub Pages serves 404.html while preserving the requested URL. Keeping
      // an SPA copy here lets BrowserRouter resolve routes such as /rsvp on reload.
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH),
    plugins: [react(), weddingHtml(env.VITE_SITE_URL)],
    build: {
      chunkSizeWarningLimit: 600,
    },
  }
})
