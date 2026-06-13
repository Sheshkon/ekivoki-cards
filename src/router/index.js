import {isMobileDevice} from "../utils/device.js";
import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CardsApp from '../App.vue';
import BoardView from '../views/BoardView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/cards',
            name: 'cards',
            component: CardsApp
        },
        {
            path: '/board',
            name: 'board',
            component: BoardView,
            beforeEnter: () => {
                if (isMobileDevice()) {
                    return '/cards'
                }
                return true
            }
        }
    ]
});

router.beforeEach((to) => {
    if (to.name === 'home' && isMobileDevice()) {
        return { path: '/cards', replace: true }
    }
})

export default router;
