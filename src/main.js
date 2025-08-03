import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'semantic-ui-css/semantic.min.css'
import { useAuth } from '@/components/useAuth'

const app = createApp(App)

// Initialize auth state from localStorage
const { initAuth } = useAuth()
initAuth()

app.use(router).mount('#app')