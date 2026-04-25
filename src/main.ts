import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupWorker } from 'msw/browser'
import { handlers } from './mocks/handlers'
import App from './App.vue'
import router from './router/router'

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css'
import './assets/icons.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const worker = setupWorker(...handlers)

worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router);
    app.mount('#app')
})
