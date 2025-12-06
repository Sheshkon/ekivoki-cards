import {
    GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree, GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix
} from 'vue-icons-plus/gi'
import i18n from '../i18n';

export const getDiceIcon = (diceNumber) => {
    const icons = {
        1: GiDiceSixFacesOne,
        2: GiDiceSixFacesTwo,
        3: GiDiceSixFacesThree,
        4: GiDiceSixFacesFour,
        5: GiDiceSixFacesFive,
        6: GiDiceSixFacesSix
    }

    return icons[diceNumber] || GiDiceSixFacesOne
}

export const buildGoogleSheetCsvUrl = (url) => {
    const t =  i18n.global.t

    const validationMessages = []
    let gid = null
    let sheetId = null
    let csvUrl = null

    try {
        const parsed = new URL(url)

        const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/)
        if (match) {
            sheetId = match[1]
        } else {
            validationMessages.push(t('errors.sheet_id_not_found'))
        }

        gid = parsed.searchParams.get('gid')
        if (!gid && parsed.hash.includes('gid=')) {
            gid = parsed.hash.split('gid=')[1]
        }

        if (!parsed.hostname.endsWith('google.com'))
            validationMessages.push(t('errors.not_google'))

        if (!parsed.pathname.includes('/spreadsheets/'))
            validationMessages.push(t('errors.not_sheets'))

        if (!gid)
            validationMessages.push(t('errors.gid_missing'))

        if (gid && !/^\d+$/.test(gid))
            validationMessages.push(t('errors.gid_invalid'))

        if (sheetId && gid) {
            csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}#gid=${gid}`
        }
    } catch (err) {
        validationMessages.push(t('errors.invalid_url'))
    }

    return {sheetId, gid, csvUrl, validationMessages}
}