import { CSSProperties } from "vue"
import { cssPropertiesObject } from "./styleValue"

const textComponent = {
  id: "text-component",
  name: "text",
  content: "Selamat datang!",
  tag: "h4",
  props: {
    style: cssPropertiesObject,
    class: 'text-xl font-bold text-center text-gray-900 dark:text-gray-100',
  }
}

const buttonComponent = {
  id: "button-component",
  name: "button",
  props: {
    pv: {
      // PrimeVue props murni
      label: "Kirim",
      severity: "primary",
      rounded: true,
      icon: "pi pi-send",
      // pt: {
      //   root: 'w-full',
      //   label: 'text-lg font-semibold'
      // }
    },
    style: cssPropertiesObject,
    // class: 'text-4xl font-bold text-center text-gray-900 dark:text-gray-100',
  }
}


const wrapperComponent = {
  id: "wrapper",
  name: "wrapper",
  props: {
    style: {
      backgroundColor: '#FF8D8D',
    } as CSSProperties,
    class: 'p-4 bg-gray-100 rounded-lg h-screen flex flex-col gap-4 items-center justify-center',
  },
  children: [
    textComponent,
    buttonComponent
  ]
}

const heroBlock = {
  id: "block-1",
  name: "Hero 1",
  type: "custom",
  child: wrapperComponent
}


export const newModelPages = {
  'home': {
    name: 'home',
    slug: 'home',
    url: '/',
    seoMeta: {
      title: 'Home - Welcome to Our Platform',
      description: 'Transform your workflow with our innovative platform.',
      ogImage: 'https://primefaces.org/cdn/primevue/images/landing/screen-1.png',
      type: 'website'
    },
    blocks: [
      heroBlock
    ],
    meta: {
      type: 'landing',
      category: 'utility'
    }
  }
}