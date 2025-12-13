import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {useDexie} from "../composable/useDexie.js"
import {buildGoogleSheetCsvUrl} from "../components/utils.js"
import i18n from '../i18n'
import {BACKGROUNDS, CARDS_GOOGLE_SHEET_URL, DEFAULT_SETTINGS, SPECIAL_CARDS_CSV_URL} from "./config.js"

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: useLocalStorage('settings', {...DEFAULT_SETTINGS}),
        persistentSettings: useDexie("settings", {
            cardsGoogleSheetUrl: CARDS_GOOGLE_SHEET_URL,
            specialCardsGoogleSheetUrl: SPECIAL_CARDS_CSV_URL
        }),
        isSettingsScreenOpened: false,
    }),
    actions: {
        initSettings() {
            this.detectSystemTheme()
            this.setBackground(this.settings.backgroundKey)
            this.setThemeColor(this.settings.themeColor)
            i18n.global.locale.value = this.settings.language
        },

        detectSystemTheme() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            this.settings.theme = prefersDark ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', this.settings.theme)

            // слушаем изменения системной темы
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            mediaQuery.addEventListener('change', e => {
                this.settings.theme = e.matches ? 'dark' : 'light'
                document.documentElement.setAttribute('data-theme', this.settings.theme)
            })
        },

        toggleTheme() {
            this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark'
            document.documentElement.setAttribute('data-theme', this.settings.theme)
        },

        toggleSettingsScreen() {
            this.isSettingsScreenOpened = !this.isSettingsScreenOpened
        },

        setLanguage(lang) {
            if (!lang) return
            this.settings.language = lang
            i18n.global.locale.value = lang
        },

        setThemeColor(newColor) {
            this.settings.themeColor = newColor
            document.documentElement.style.setProperty("--color-teal", newColor)
            const metaTheme = document.querySelector("meta[name='theme-color']")
            if (metaTheme) {
                metaTheme.setAttribute("content", newColor)
            }
        },

        updateGoogleSheetCardsUrl(url = null, isSpecial = false) {
            let csvUrl = null
            let validationMessages = []

            if (url) {
                const result = buildGoogleSheetCsvUrl(url)
                csvUrl = result.csvUrl
                validationMessages = result.validationMessages
                if (validationMessages.length > 0) {
                    return validationMessages
                }
            } else {
                csvUrl = isSpecial ? SPECIAL_CARDS_CSV_URL : CARDS_GOOGLE_SHEET_URL
            }

            if (isSpecial) {
                this.persistentSettings.specialCardsGoogleSheetUrl = csvUrl
            } else {
                this.persistentSettings.cardsGoogleSheetUrl = csvUrl
            }

            return []
        },

        setBackground(key) {
            const pattern = BACKGROUNDS.find(p => p.key === key)
            if (pattern) {
                document.documentElement.style.setProperty("--app-background", pattern.svg)
            }
        },

        resetToDefaults() {
            this.settings = {
                theme: DEFAULT_SETTINGS.theme,
                sound: DEFAULT_SETTINGS.sound,
                language: DEFAULT_SETTINGS.language,
                themeColor: DEFAULT_SETTINGS.themeColor,
                backgroundKey: DEFAULT_SETTINGS.backgroundKey
            }
            this.persistentSettings.cardsGoogleSheetUrl = CARDS_GOOGLE_SHEET_URL
            this.persistentSettings.specialCardsGoogleSheetUrl = SPECIAL_CARDS_CSV_URL
            this.initSettings()
        }
    }
})