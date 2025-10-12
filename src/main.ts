import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router/index'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

const app = createApp(App)

app.use(Vue3Toastify, {
  autoClose: 4000,
} as ToastContainerOptions)
app.use(createPinia())
app.use(router)

app.mount('#app')
