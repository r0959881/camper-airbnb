import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
// import './assets/main.css'; // <-- This line imports Tailwind and your main styles

createApp(App)
  .use(router)
  .mount('#app');