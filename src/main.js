/**
 * Main Entry Point
 * 
 * This is the main entry file for our Vue.js application.
 * It creates the Vue app instance and mounts it to the DOM.
 * 
 * BEGINNER TIP: This file is where everything starts. It:
 * 1. Creates the Vue application
 * 2. Registers global plugins (like Vue Router)
 * 3. Mounts the app to an HTML element
 */

// Import Vue's createApp function
import { createApp } from 'vue'

// Import global styles
import './styles/main.less'

// Import the root App component
import App from './App.vue'

// Import Vue Router configuration
import router from './router'

/**
 * Create the Vue Application
 * 
 * createApp() creates a new Vue application instance.
 * We pass our root component (App) as the argument.
 */
const app = createApp(App)

/**
 * Register Plugins
 * 
 * Plugins extend Vue's functionality. Vue Router is a plugin
 * that adds routing capabilities to our application.
 * 
 * The .use() method registers a plugin with the app.
 */
app.use(router)

/**
 * Mount the Application
 * 
 * The .mount() method attaches our Vue app to a DOM element.
 * '#app' refers to the <div id="app"> in index.html.
 * 
 * After mounting, Vue takes control of that element and its children,
 * rendering our components and handling reactivity.
 */
app.mount('#app')

/**
 * Development Helpers
 * 
 * Log a message to confirm the app has started.
 * This is helpful for debugging during development.
 */
console.log('🚀 AEM Dashboard Simulator started!')
console.log('📚 Vue.js version:', app.version)
console.log('💡 Tip: Make sure json-server is running on port 3001')
