import {defineStore} from 'pinia';
import {db, getCards, getMeta, incrementShowedCount, saveMeta, upsertCards} from '../services/IndexedDBService';
import {fetchCards} from '../services/GoogleSheetService';

export const useGameStore = defineStore('game', {
    state: () => ({
        mainDeck: [],
        specialDeck: [],
        currentCard: null,
        phase: 'idle', // idle, active, loading
        timerActive: false,
        isOffline: !navigator.onLine,
        isLoading: false
    }),

    actions: {
        async initialize() {
            this.isLoading = true;
            const cachedDeck = await getCards(db.cards);
            const cachedSpecialDeck = await getCards(db.specialCards);
            const lastSync = await getMeta('lastSyncTime') || 0;
            const now = Date.now();
            const isCached = cachedDeck.length && cachedSpecialDeck.length

            if (isCached) {
                this.mainDeck = cachedDeck;
                this.specialDeck = cachedSpecialDeck;
            }

            if ((!isCached || now - lastSync > 86400000) && navigator.onLine) {
                await this.sync();
            }
            this.isLoading = false;
            this.phase = 'idle';
        },

        async sync() {
            try {
                const {cards, specialCards} = await fetchCards();
                if (cards.length) {
                    await upsertCards(db.cards, cards);
                    await upsertCards(db.specialCards, specialCards);
                    await saveMeta('lastSyncTime', Date.now());
                    this.mainDeck = cards;
                    this.specialDeck = specialCards;
                    console.log("Колода обновлена")
                } else {
                    console.warn("Колода пуста после синхронизации.");
                }
            } catch (error) {
                console.error("Ошибка синхронизации:", error);
                alert("Не удалось загрузить данные. Используются кешированные карточки.");
            }
        },

        async generateCard(isSpecial) {
            const deck = isSpecial ? this.specialDeck : this.mainDeck;

            if (!deck.length) {
                alert(`Колода ${isSpecial ? 'особых' : 'основных'} карт пуста! Обновите данные.`);
                this.phase = 'idle';
                return;
            }

            const minCount = Math.min(...deck.map(card => card.showedCount ?? 0));
            const candidates = deck.filter(card => (card.showedCount ?? 0) === minCount);
            const rand = Math.floor(Math.random() * candidates.length);
            const chosen = candidates[rand];
            const chosenIndex = deck.findIndex(c => c.id === chosen.id);

            if (chosenIndex !== -1) {
                deck[chosenIndex] = {
                    ...deck[chosenIndex],
                    showedCount: (deck[chosenIndex].showedCount ?? 0) + 1
                };
            }

            this.currentCard = {
                ...chosen,
                isSpecial
            };


            if (isSpecial) {
                await incrementShowedCount(db.specialCards, chosen.id)
            } else {
                await incrementShowedCount(db.cards, chosen.id)
            }

            this.timerActive = false;
            this.phase = 'active';
        },

        setTimerStatus(status) {
            this.timerActive = status;
        },

        async skipCard() {
            if (this.timerActive) return;
            await this.generateCard(this.currentCard.isSpecial);
        },

        finishTurn() {
            this.phase = 'idle';
            this.currentCard = null;
            this.timerActive = false;
        }
    }
});