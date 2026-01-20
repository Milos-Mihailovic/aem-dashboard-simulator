/**
 * Vue Router Configuration
 * 
 * Vue Router is the official router for Vue.js. It allows us to:
 * - Create single-page applications (SPA) with multiple views
 * - Navigate between different pages without full page reloads
 * - Pass parameters and query strings to routes
 * 
 * BEGINNER TIP: Think of routes as a map that tells Vue which component
 * to display when the user visits a specific URL.
 */

import { createRouter, createWebHistory } from 'vue-router'

// Import our page components
// These are the main views/pages of our application
import Dashboard from '../views/Dashboard.vue'
import Components from '../views/Components.vue'
import Pages from '../views/Pages.vue'
import ComponentDetail from '../views/ComponentDetail.vue'

/**
 * Route Definitions
 * 
 * Each route object contains:
 * - path: The URL path (e.g., '/dashboard')
 * - name: A unique name for the route (useful for programmatic navigation)
 * - component: The Vue component to render for this route
 * - meta: Additional metadata (we use it for page titles)
 */
const routes = [
  {
    // Redirect root path to dashboard
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      title: 'My Dashboard',
      icon: '📊' // Icon for navigation
    }
  },
  {
    path: '/components',
    name: 'Components',
    component: Components,
    meta: { 
      title: 'AEM Components',
      icon: '🧩'
    }
  },
  {
    path: '/components/:id',
    name: 'ComponentDetail',
    component: ComponentDetail,
    meta: { 
      title: 'Component Details',
      icon: '🔍'
    },
    // Props: true allows route params to be passed as component props
    props: true
  },
  {
    path: '/pages',
    name: 'Pages',
    component: Pages,
    meta: { 
      title: 'Content Pages',
      icon: '📄'
    }
  }
]

/**
 * Create the Router Instance
 * 
 * createWebHistory() uses the HTML5 History API for clean URLs
 * (e.g., /dashboard instead of /#/dashboard)
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll behavior: scroll to top when navigating to a new page
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * Navigation Guard
 * 
 * This runs before each route navigation.
 * We use it to update the page title dynamically.
 * 
 * BEGINNER TIP: Navigation guards are like middleware - they intercept
 * navigation and can perform actions or even cancel navigation.
 */
router.beforeEach((to, from, next) => {
  // Update document title based on route meta
  document.title = `${to.meta.title || 'AEM Dashboard'} | AEM Dashboard Simulator`
  next() // Always call next() to proceed with navigation
})

export default router
