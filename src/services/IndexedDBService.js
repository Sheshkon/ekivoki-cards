import Dexie from 'dexie';

export const db = new Dexie('EkivokiDB');

db.version(1).stores({
    cards: 'id, theme',
    specialCards: 'id, theme',
    meta: 'key'
});

db.version(2).stores({
    cards: 'id, theme, showedCount',
    specialCards: 'id, theme, showedCount',
    meta: 'key'
});

db.version(3).stores({
    cards: 'id, theme, showedCount',
    specialCards: 'id, theme, showedCount',
    meta: 'key',
    settings: 'key,value'
})

export const upsertCards = async (table, cards) => {
    await db.transaction('rw', table, async () => {
        for (const card of cards) {
            const existing = await table.get(card.id);
            if (existing) {
                await table.put({
                    ...existing,
                    ...card,
                    showedCount: existing.showedCount ?? 0
                });
            } else {
                await table.put({
                    ...card,
                    showedCount: 0
                });
            }
        }
    });
};

export const getCards = async (table) => await table.toArray();

export const incrementShowedCount = async (table, id) => {
    await db.transaction('rw', table, async () => {
        await table.where('id').equals(id).modify(item => {
            item.showedCount = (item.showedCount ?? 0) + 1;
        });
    });
};

export const saveMeta = async (key, value) => await db.meta.put({ key, value });
export const getMeta = async (key) => (await db.meta.get(key))?.value;