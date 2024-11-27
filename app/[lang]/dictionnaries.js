import 'server-only'

const dictionaries = {
    en: () => import('@/i18n/en-US/lang.json').then((module) => module.default),
    fr: () => import('@/i18n/fr-FR/lang.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()