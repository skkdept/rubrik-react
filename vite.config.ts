import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // The Railway deployment serves this app behind server.js at the /rubrik
  // subpath (see server.js), so built asset URLs need that prefix. The dev
  // server keeps serving from / for a normal local `npm run dev` experience.
  base: mode === 'production' ? '/rubrik/' : '/',
  plugins: [react()],
  css: {
    modules: {
      // Vite's own default omits the source filename entirely
      // (`_section_7w62x_1` — just the local class name + hash + index),
      // which makes every component's classes indistinguishable from every
      // other's in devtools. Include the component name so a class reads as
      // e.g. `SiteHeader_section_a1b2c` — this also matters for this
      // project specifically: an eventual EDS conversion means someone will
      // be reading these class names in devtools/exported markup to figure
      // out which hand-written component CSS a given element belongs to.
      generateScopedName:
        mode === 'production'
          ? '[hash:base64:6]'
          : '[name]__[local]___[hash:base64:5]',
    },
  },
}))
