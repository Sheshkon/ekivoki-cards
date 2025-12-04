import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vSwipe from './directives/vSwipe';
import VSwatches from "vue3-swatches";
import i18n from './i18n';
import "vue3-select-component/styles";
import 'vue3-swatches/dist/style.css'

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(VSwatches)
app.directive('swipe', vSwipe);

app.mount('#app');