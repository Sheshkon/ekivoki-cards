import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import vSwipe from './directives/vSwipe';
import VSwatches from "vue3-swatches";
import i18n from './i18n';
import Toast from 'vue-toastification'
import {toastOptions} from "./plugins/toastConfig.js";
import 'vue-toastification/dist/index.css'
import '@vueform/multiselect/themes/default.css'
import 'vue3-swatches/dist/style.css'
import './styles/multiselect.css'
import './styles/background.css'

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(Toast, toastOptions)
app.use(VSwatches)
app.directive('swipe', vSwipe);
app.mount('#app');