/**
 * Smart i18n Composable
 * 
 * Provides utilities for handling both static UI translations (from JSON files)
 * and dynamic content translations (from backend via sysMenuLangs structure)
 * 
 * Usage:
 * ```ts
 * const { getLocalizedText } = useSmartI18n();
 * 
 * // For backend content with sysMenuLangs structure
 * const title = getLocalizedText(menuItem.sysMenuLangs);
 * 
 * // For static UI translations
 * const buttonLabel = t('common.submit');
 * ```
 */
export const useSmartI18n = () => {
  const { locale, t } = useI18n();

  /**
   * Get localized text from sysMenuLangs structure
   * Falls back to default language if current locale not found
   * 
   * @param translations - Array of translations with { langId, title, ... } structure
   * @param field - Field name to extract (default: 'title')
   * @param defaultLang - Fallback language code (default: 'en')
   * @returns Localized text or empty string
   */
  const getLocalizedText = (
    translations: any[] | undefined,
    field: string = 'title',
    defaultLang: string = 'en'
  ): string => {
    if (!translations || !Array.isArray(translations)) {
      return '';
    }

    // Try to find current locale
    const currentTranslation = translations.find(
      (trans) => trans.langId === locale.value
    );

    if (currentTranslation && currentTranslation[field]) {
      return currentTranslation[field];
    }

    // Fallback to default language
    const defaultTranslation = translations.find(
      (trans) => trans.langId === defaultLang
    );

    if (defaultTranslation && defaultTranslation[field]) {
      return defaultTranslation[field];
    }

    // Last resort: return first available translation
    const firstTranslation = translations[0];
    return firstTranslation?.[field] || '';
  };

  /**
   * Get localized content for pages/blocks
   * Handles JSONB translation structure: { en: {...}, id: {...} }
   * 
   * @param translations - Object with language codes as keys
   * @param field - Field name to extract
   * @param defaultLang - Fallback language code
   * @returns Localized content or empty string
   */
  const getLocalizedContent = (
    translations: Record<string, any> | undefined,
    field: string = 'content',
    defaultLang: string = 'en'
  ): string => {
    if (!translations || typeof translations !== 'object') {
      return '';
    }

    // Try current locale
    const currentLangContent = translations[locale.value];
    if (currentLangContent && currentLangContent[field]) {
      return currentLangContent[field];
    }

    // Fallback to default language
    const defaultLangContent = translations[defaultLang];
    if (defaultLangContent && defaultLangContent[field]) {
      return defaultLangContent[field];
    }

    // Last resort: return first available translation
    const firstLang = Object.keys(translations)[0];
    const firstContent = translations[firstLang];
    return firstContent?.[field] || '';
  };

  /**
   * Get all fields from translation for current locale
   * Useful when you need multiple fields at once
   * 
   * @param translations - Translation object or array
   * @param defaultLang - Fallback language code
   * @returns Object with all translated fields
   */
  const getLocalizedObject = (
    translations: any,
    defaultLang: string = 'en'
  ): Record<string, any> => {
    if (!translations) {
      return {};
    }

    // Handle sysMenuLangs array structure
    if (Array.isArray(translations)) {
      const currentTranslation = translations.find(
        (trans) => trans.langId === locale.value
      );

      if (currentTranslation) {
        return currentTranslation;
      }

      const defaultTranslation = translations.find(
        (trans) => trans.langId === defaultLang
      );

      return defaultTranslation || translations[0] || {};
    }

    // Handle JSONB object structure
    if (typeof translations === 'object') {
      return translations[locale.value] || translations[defaultLang] || {};
    }

    return {};
  };

  /**
   * Check if translations exist for current locale
   * 
   * @param translations - Translation object or array
   * @returns Boolean indicating if translation exists
   */
  const hasTranslation = (translations: any): boolean => {
    if (!translations) return false;

    if (Array.isArray(translations)) {
      return translations.some((trans) => trans.langId === locale.value);
    }

    if (typeof translations === 'object') {
      return !!translations[locale.value];
    }

    return false;
  };

  return {
    locale,
    t,
    getLocalizedText,
    getLocalizedContent,
    getLocalizedObject,
    hasTranslation,
  };
};
