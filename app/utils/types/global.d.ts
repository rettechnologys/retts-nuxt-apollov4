// Global declarations for the application
declare global {
  const __APP_VERSION__: string
  const __VUE_I18N_FULL_INSTALL__: boolean
  const __VUE_I18N_LEGACY_API__: boolean
  const __INTLIFY_PROD_DEVTOOLS__: boolean
}

// Module declarations for assets
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<unknown, object, any>
  export default component
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

// CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

export {}
