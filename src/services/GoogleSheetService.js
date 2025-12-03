import {useSettingsStore} from "../stores/useSettingsStore.js";

export const fetchCards = async () => {
    const {persistentSettings} = await useSettingsStore()

    try {
        const [cardsCsv, specialCsv] = await Promise.all([
            fetch(persistentSettings.cardsGoogleSheetUrl).then(res => res.ok ? res.text() : Promise.reject('Cards fetch failed')),
            fetch(persistentSettings.specialCardsGoogleSheetUrl).then(res => res.ok ? res.text() : Promise.reject('Special fetch failed'))
        ]);

        const cards = parseCardsCSV(cardsCsv);
        const specialCards = parseSpecialCSV(specialCsv);

        console.log(cards)

        return {cards, specialCards};
    } catch (error) {
        console.error('Fetching error:', error);
        return {cards: [], specialCards: []};
    }
};

function parseCardsCSV(csvText) {
    const rows = csvText.trim().split('\n').map(row => row.split(','));

    return rows.slice(1).map(col => ({
        id: col[0]?.trim() || '',
        topic: col[1]?.trim() || '',
        dice: {
            1: {phrase: col[2]?.trim() || '', type: col[3]?.trim() || ''},
            2: {phrase: col[4]?.trim() || '', type: col[5]?.trim() || ''},
            3: {phrase: col[6]?.trim() || '', type: col[7]?.trim() || ''},
            4: {phrase: col[8]?.trim() || '', type: col[9]?.trim() || ''},
            5: {phrase: col[10]?.trim() || '', type: col[11]?.trim() || ''}
        },
        comments: col[12]?.trim() || '',
        author: col[13]?.trim() || ''
    })).filter(c => c.id && c.topic);
}

function parseSpecialCSV(csvText) {
    const rows = csvText.trim().split('\n').map(row => row.split(','));

    return rows.slice(1).map(col => ({
        id: col[0]?.trim() || '',                 // Special_Card_ID
        topic: col[1]?.trim() || '',              // Topic
        dice6: {
            phrase: col[2]?.trim() || '',         // Dice 6 Phrase
            type: col[3]?.trim() || ''            // Dice 6 Type
        },
        comments: col[4]?.trim() || '',           // Comments / Notes
        author: col[5]?.trim() || ''              // Author
    })).filter(c => c.id && c.topic && c.dice6.phrase);
}
