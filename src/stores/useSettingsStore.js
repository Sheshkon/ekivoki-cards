import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {useDexie} from "../composable/useDexie.js";
import {buildGoogleSheetCsvUrl} from "../components/utils.js";
import i18n from '../i18n';

const SHEET_ID = '13eAGD0f2Y1BcLqpgwoAcV5q5BouyzZ4E7HFa1UtfDwI';
const CARDS_GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=2001267068#gid=2001267068`;
const SPECIAL_CARDS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1966736245#gid=1966736245`;

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: useLocalStorage('settings', {
            theme: 'light',
            sound: true,
            language: 'en',
            themeColor: '#4ECDC4'
        }),
        persistentSettings: useDexie("settings", {
            cardsGoogleSheetUrl: CARDS_GOOGLE_SHEET_URL,
            specialCardsGoogleSheetUrl: SPECIAL_CARDS_CSV_URL
        }),
        isSettingsScreenOpened: false,
    }),
    actions: {
        initSettings() {
            const color = this.settings.themeColor ?? "#4ECDC4";
            document.documentElement.setAttribute('data-theme', this.settings.theme);
            document.documentElement.style.setProperty("--color-teal", color);
            const metaTheme = document.querySelector("meta[name='theme-color']");
            if (metaTheme) {
                metaTheme.setAttribute("content", color);
            }
            i18n.global.locale.value = this.settings.language
        },

        toggleTheme() {
            this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark'
            document.documentElement.setAttribute('data-theme', this.settings.theme)
        },

        toggleSettingsScreen() {
            this.isSettingsScreenOpened = !this.isSettingsScreenOpened
        },

        setLanguage(lang) {
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
        }
    }
})