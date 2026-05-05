import { defineStore } from 'pinia';
import {
    db,
    getCards,
    getMeta,
    incrementShowedCount,
    saveMeta,
    upsertCards
} from '../services/IndexedDBService';

import { fetchCards } from '../services/GoogleSheetService';
import i18n from '../i18n';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useGameStore = defineStore('game', {
    state: () => ({
        mainDeck: [],
        specialDeck: [],

        deckQueue: [],
        queueIndex: 0,

        currentCard: null,
        phase: 'idle',

        timerActive: false,

        // 🔥 НОВОЕ: режим игры
        mode: null, // 'normal' | 'special'

        isOffline: !navigator.onLine,
        isLoading: false
    }),

    getters: {
        visibleCards: (state) => {
            const start = state.queueIndex ?? 0;
            return (state.deckQueue ?? []).slice(start, start + 4);
        }
    },

    actions: {

        /* =========================
           INIT
        ========================= */
        async initialize() {
            this.isLoading = true;

            const cachedDeck = await getCards(db.cards);
            const cachedSpecialDeck = await getCards(db.specialCards);

            const lastSync = await getMeta('lastSyncTime') || 0;
            const now = Date.now();

            const isCached = cachedDeck.length && cachedSpecialDeck.length;

            if (isCached) {
                this.mainDeck = cachedDeck;
                this.specialDeck = cachedSpecialDeck;
            }

            if ((!isCached || now - lastSync > 86400000) && navigator.onLine) {
                await this.sync();
            }

            this.isLoading = false;
        },

        /* =========================
           START GAME (🔥 ключевой метод)
        ========================= */
        async startGame(mode) {
            this.mode = mode; // 'normal' | 'special'

            this.deckQueue = [];
            this.queueIndex = 0;
            this.currentCard = null;

            // префилл очереди
            for (let i = 0; i < 4; i++) {
                await this.generateCard();
            }

            this.currentCard = this.deckQueue[0];
            this.phase = 'active';
        },

        /* =========================
           SYNC
        ========================= */
        async sync() {
            try {
                const { cards, specialCards } = await fetchCards();

                if (cards.length) {
                    await upsertCards(db.cards, cards);
                    await upsertCards(db.specialCards, specialCards);
                    await saveMeta('lastSyncTime', Date.now());

                    this.mainDeck = cards;
                    this.specialDeck = specialCards;

                    toast.success(i18n.global.t('alerts.deck_updated'));
                } else {
                    toast.warning("Deck is empty after sync.");
                }
            } catch (e) {
                console.error(e);
                toast.error(i18n.global.t('alerts.dataLoadFailed'));
            }
        },

        /* =========================
           CARD GENERATION
        ========================= */
        async generateCard() {
            const isSpecial = this.mode === 'special';
            const deck = isSpecial ? this.specialDeck : this.mainDeck;

            if (!deck.length) return;

            const minCount = Math.min(...deck.map(c => c.showedCount ?? 0));
            const candidates = deck.filter(c => (c.showedCount ?? 0) === minCount);

            const chosen = candidates[Math.floor(Math.random() * candidates.length)];

            const newCard = {
                ...chosen,
                isSpecial,
                _uid: crypto.randomUUID()
            };

            this.deckQueue.push(newCard);

            // контроль размера очереди
            if (this.deckQueue.length > 20) {
                this.deckQueue.splice(0, 2);
                this.queueIndex = Math.max(0, this.queueIndex - 2);
            }

            // обновление статистики
            if (isSpecial) {
                await incrementShowedCount(db.specialCards, chosen.id);
            } else {
                await incrementShowedCount(db.cards, chosen.id);
            }
        },

        /* =========================
           SWIPE
        ========================= */
        async skipCard() {
            if (this.timerActive) return;

            this.queueIndex++;

            // всегда генерим следующую карту по текущему режиму
            await this.generateCard();

            this.currentCard = this.deckQueue[this.queueIndex];
        },

        /* =========================
           TIMER
        ========================= */
        setTimerStatus(status) {
            this.timerActive = status;
        },

        /* =========================
           RESET
        ========================= */
        finishTurn() {
            this.phase = 'idle';
            this.deckQueue = [];
            this.queueIndex = 0;
            this.currentCard = null;
            this.timerActive = false;
            this.mode = null;
        }
    }
});