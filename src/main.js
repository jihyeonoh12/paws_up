import { createApp } from 'vue'
import { createPinia } from 'pinia';

import './output.css'
import App from './App.vue'
import router from './router/index.js';
import { initializeAuthListener } from "./utils/checkUserStatus";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia) 
.use(router); 

initializeAuthListener();

app.mount("#app");