import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import ru from './locales/ru.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import es from './locales/es.json'
import it from './locales/it.json'
import zh from './locales/zh.json'

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        ru,
        fr,
        de,
        es,
        it,
        zh
    }
})

export const langOptions = [
    {label: "English", value: "en"},
    {label: "Русский", value: "ru"},
    {label: "Français", value: "fr"},
    {label: "Deutsch", value: "de"},
    {label: "Español", value: "es"},
    {label: "Italiano", value: "it"},
    {label: "中文", value: "zh"}
];

export default i18n