import type { GlobalConfigs } from "~~/shared"

export default defineEventHandler((event) => {
  const request = event.node.req
  console.log('Request', request.method)
  const globalConfig: GlobalConfigs = {
    menus: [
      {
        name: 'home', link: '/', sysMenuLangs: [
          {
            code: 'en',
            description: 'Home',
          },
          {
            code: 'fr',
            description: 'Accueil',
          },
          {
            code: 'de',
            description: 'Startseite',
          },
        ]
      },
      {
        name: 'highlights', link: '/highlights', sysMenuLangs: [
          {
            code: 'en',
            description: 'Highlights',
          },
          {
            code: 'fr',
            description: 'Points forts',
          },
          {
            code: 'de',
            description: 'Highlights',
          },
        ]
      },
      {
        name: 'articles', sysMenuLangs: [
          {
            code: 'en',
            description: 'Articles',
          },
          {
            code: 'fr',
            description: 'Articles',
          },
          {
            code: 'de',
            description: 'Artikel',
          },
        ],
        children: [
          {
            name: 'blog', link: '/articles/blog', sysMenuLangs: [
              {
                code: 'en',
                description: 'Blog',
              },
              {
                code: 'fr',
                description: 'Blog',
              },
              {
                code: 'de',
                description: 'Blog',
              },
            ]
          },
          {
            name: 'news', link: '/articles/news', sysMenuLangs: [
              {
                code: 'en',
                description: 'News',
              },
              {
                code: 'fr',
                description: 'Nouvelles',
              },
              {
                code: 'de',
                description: 'Nachrichten',
              },
            ]
          },
        ]
      }
    ],
  }
  return globalConfig
  }
)