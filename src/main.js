import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vSwipe from './directives/vSwipe';
import VSwatches from "vue3-swatches";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(VSwatches)
app.directive('swipe', vSwipe);

app.mount('#app');