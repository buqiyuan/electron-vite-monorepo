import { defineConfig } from 'vitepress'

const isProd = process.env.NODE_ENV === 'production'
const baseUrl = isProd ? '/electron-vite-monorepo' : ''

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: baseUrl,
  title: 'Electron Vite Monorepo',
  description: 'Electron Turborepo monorepo with Vue, Vite boilerplate',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${baseUrl}/logo.svg` }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/buqiyuan/electron-vite-monorepo' },
    ],
  },
})
