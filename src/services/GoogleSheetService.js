const SHEET_ID = '13eAGD0f2Y1BcLqpgwoAcV5q5BouyzZ4E7HFa1UtfDwI';
const CARDS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=2001267068#gid=2001267068`;
const SPECIAL_CARDS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1966736245#gid=1966736245`;

export const fetchCards = async () => {
    try {
        const [cardsCsv, specialCsv] = await Promise.all([
            fetch(CARDS_CSV_URL).then(res => res.ok ? res.text() : Promise.reject('Cards fetch failed')),
            fetch(SPECIAL_CARDS_CSV_URL).then(res => res.ok ? res.text() : Promise.reject('Special fetch failed'))
        ]);

        const cards = parseCardsCSV(cardsCsv);
        const specialCards = parseSpecialCSV(specialCsv);

        return { cards, specialCards };
    } catch (error) {
        console.error('Fetching error:', error);
        return { cards: [], specialCards: [] };
    }
};

function parseCardsCSV(csvText) {
    const rows = csvText.trim().split('\n').map(row => row.split(','));

    return rows.slice(1).map(col => ({
        id: col[0]?.trim() || '',
        topic: col[1]?.trim() || '',
        dice: {
            1: { phrase: col[2]?.trim() || '', type: col[3]?.trim() || '' },
            2: { phrase: col[4]?.trim() || '', type: col[5]?.trim() || '' },
            3: { phrase: col[6]?.trim() || '', type: col[7]?.trim() || '' },
            4: { phrase: col[8]?.trim() || '', type: col[9]?.trim() || '' },
            5: { phrase: col[10]?.trim() || '', type: col[11]?.trim() || '' }
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
