import {createApp} from 'vue';
import {createPinia} from 'pinia';
import RootApp from './RouterApp.vue';
import vSwipe from './directives/vSwipe';
import VSwatches from "vue3-swatches";
import i18n from './i18n';
import Toast from 'vue-toastification'
import {toastOptions} from "./plugins/toastConfig.js";
import router from './router';
import 'vue-toastification/dist/index.css'
import '@vueform/multiselect/themes/default.css'
import 'vue3-swatches/dist/style.css'
import './styles/multiselect.css'
import './styles/toast.css'

const pinia = createPinia();
const app = createApp(RootApp);

app.use(pinia);
app.use(i18n);
app.use(Toast, toastOptions)
app.use(VSwatches)
app.use(router);
app.directive('swipe', vSwipe);
app.mount('#app');