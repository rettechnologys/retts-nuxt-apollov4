// Global type definitions for Vue i18n

declare module 'vue-i18n' {
  // Define the locale messages schema
  export interface DefineLocaleMessage {
    // Add your translation keys here
    gl: {
      [key: string]: string
    }
    // Add more namespaces as needed
  }

  // Define the datetime formats schema
  export interface DefineDateTimeFormat {
    short: {
      year: 'numeric'
      month: 'short'
      day: 'numeric'
    }
    long: {
      year: 'numeric'
      month: 'short'
      day: 'numeric'
      weekday: 'short'
      hour: 'numeric'
      minute: 'numeric'
    }
  }

  // Define the number formats schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
