import {defineStore} from 'pinia';
import {getCards, getMeta, getSpecialCards, saveCards, saveMeta, saveSpecialCards} from '../services/IndexedDBService';
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
            const cachedDeck = await getCards();
            const cachedSpecialDeck = await getSpecialCards();
            const lastSync = await getMeta('lastSyncTime') || 0;
            const now = Date.now();
            const isCached = cachedDeck.length && cachedSpecialDeck.length

            if (isCached){
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
                    await saveCards(cards);
                    await saveSpecialCards(specialCards);
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

        generateCard(isSpecial) {
            const deck = isSpecial ? this.specialDeck : this.mainDeck;

            if (!deck.length) {
                alert(`Колода ${isSpecial ? 'особых' : 'основных'} карт пуста! Обновите данные.`);
                this.phase = 'idle';
                return;
            }

            const rand = Math.floor(Math.random() * deck.length);
            this.currentCard = {
                ...deck[rand],
                isSpecial
            }

            this.timerActive = false;
            this.phase = 'active';
        },

        setTimerStatus(status) {
            this.timerActive = status;
        },

        skipCard() {
            if (this.timerActive) return;

            this.generateCard(this.currentCard.isSpecial);
        },

        finishTurn() {
            this.phase = 'idle';
            this.currentCard = null;
            this.timerActive = false;
        }
    }
});