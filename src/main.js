import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/js/all.js'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(VueSweetalert2);
app.mount('#app');

axios.interceptors.request.use(
  config => {
    const token = store.state.token; // store에서 토큰을 가져옴
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰을 추가
    }
    return config;
  },
  error => Promise.reject(error)
);
// createApp(App).use(store).use(router).mount('#app')
