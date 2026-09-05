import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

function normalizeBasePath(value: string | undefined) {
  const basePath = value?.trim() || '/'
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      // GitHub Pages serves 404.html while preserving the requested URL. Keeping
      // an SPA copy here lets BrowserRouter resolve routes such as /rsvp on reload.
      copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH),
    plugins: [react(), githubPagesSpaFallback()],
    build: {
      chunkSizeWarningLimit: 600,
    },
  }
})
