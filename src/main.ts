import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { arcaneTheme } from './theme/arcaneTheme'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, { unstyled: true, pt: arcaneTheme })
  .mount('#app')
