/**
 * Type definitions for i18n translation keys
 * Auto-generated based on locale file structure
 */

// Import locale types for better inference
type EnLocale = typeof import('~/locales/en.json')

/**
 * Generate nested key paths for translation objects
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

/**
 * All possible translation keys from the locale files
 */
export type LocaleKeys = NestedKeyOf<EnLocale>

/**
 * Helper type for translation parameters
 */
export type TranslationParameters = Record<string, string | number | boolean>

/**
 * Locale-specific interfaces
 */
export interface I18nSchema {
  welcome: string
  gl: {
    version: string
    name: string
    email: string
    search: string
    add: string
    edit: string
    delete: string
    save: string
    cancel: string
    close: string
    view: string
    detail: string
    actions: string
    loading: string
    no_data: string
    total: string
    status: string
    active: string
    inactive: string
    created_at: string
    updated_at: string
  }
  auth: {
    login: string
    logout: string
    register: string
    sign_in: string
    sign_up: string
    username: string
    password: string
    confirm_password: string
    remember_me: string
    forgot_password: string
    login_success: string
    login_failed: string
    logout_success: string
  }
  validation: {
    required: string
    email: string
    min_length: string
    max_length: string
    numeric: string
    confirmed: string
  }
  notifications: {
    success: string
    error: string
    warning: string
    info: string
    confirm: string
    save_success: string
    delete_success: string
    update_success: string
  }
}

/**
 * Extend vue-i18n types
 */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends I18nSchema {}
}
