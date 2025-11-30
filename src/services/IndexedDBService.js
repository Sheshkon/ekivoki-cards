import Dexie from 'dexie';

export const db = new Dexie('EkivokiDB');

db.version(1).stores({
    cards: 'id, theme',
    specialCards: 'id, theme',
    meta: 'key'
});


export const saveCards = async (cards) => {
    await db.cards.clear();
    await db.cards.bulkPut(cards);
};

export const getCards = async () => await db.cards.toArray();


export const saveSpecialCards = async (specialCards) => {
    await db.specialCards.clear();
    await db.specialCards.bulkPut(specialCards);
};

export const getSpecialCards = async () => await db.specialCards.toArray();


export const saveMeta = async (key, value) => await db.meta.put({ key, value });

export const getMeta = async (key) => (await db.meta.get(key))?.value;
