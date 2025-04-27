import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import './assets/main.css'; // Ensure this imports Tailwind CSS

createApp(App)
  .use(router) // Use the router
  .mount('#app');
