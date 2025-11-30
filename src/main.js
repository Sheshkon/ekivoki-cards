import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vSwipe from './directives/vSwipe'; // Импорт директивы

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.directive('swipe', vSwipe);

app.mount('#app');