<!--
  Root App Component
  
  This is the root component of our Vue.js application.
  It contains the main layout structure including:
  - Navigation sidebar
  - Main content area with router-view
  
  BEGINNER TIP: The App.vue component is like the "shell" of your
  application. It typically contains layout elements that appear
  on every page, like navigation, headers, and footers.
-->

<template>
  <div class="app">
    <!-- Navigation Sidebar -->
    <AppNavigation />
    
    <!-- Main Content Area -->
    <main class="app__main">
      <!-- Page Header -->
      <header class="app__header">
        <div class="app__breadcrumb">
          <span class="breadcrumb-home">🏠</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ currentPageTitle }}</span>
        </div>
        
        <div class="app__header-actions">
          <span class="current-time">{{ currentTime }}</span>
        </div>
      </header>
      
      <!-- Router View - This is where page components are rendered -->
      <!-- 
        The <router-view> component is a placeholder that displays
        the component matching the current route.
        
        The v-slot syntax allows us to access the matched component
        and wrap it with a transition for smooth page changes.
      -->
      <div class="app__content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
import AppNavigation from '@/components/ui/AppNavigation.vue'

export default {
  name: 'App',
  
  components: {
    AppNavigation
  },
  
  data() {
    return {
      currentTime: ''
    }
  },
  
  computed: {
    /**
     * Get the current page title from route meta
     */
    currentPageTitle() {
      return this.$route.meta?.title || 'Dashboard'
    }
  },
  
  mounted() {
    // Update time every second
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 1000)
  },
  
  /**
   * Cleanup interval when component is destroyed
   * 
   * BEGINNER TIP: Always clean up intervals, event listeners,
   * and subscriptions in beforeUnmount to prevent memory leaks.
   */
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style lang="less">
/**
 * App Layout Styles
 * 
 * These styles define the main layout structure of the application.
 * We use CSS Grid for the overall layout and Flexbox for alignment.
 */

.app {
  display: flex;
  min-height: 100vh;
  background: @background-color;
  
  &__main {
    flex: 1;
    margin-left: 280px; // Width of the sidebar
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: @surface-color;
    border-bottom: 1px solid @border-color;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  
  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  
  .breadcrumb-home {
    font-size: 1rem;
  }
  
  .breadcrumb-separator {
    color: @text-secondary;
  }
  
  .breadcrumb-current {
    color: @text-primary;
    font-weight: 500;
  }
  
  &__header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .current-time {
    font-size: 0.875rem;
    color: @text-secondary;
    font-family: monospace;
  }
  
  &__content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
}

/**
 * Page Transition Animation
 * 
 * Vue's <transition> component applies these classes during
 * enter/leave transitions. This creates a smooth fade effect
 * when navigating between pages.
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/**
 * Responsive Layout
 * 
 * On smaller screens, we adjust the layout to hide the sidebar
 * and make the content full-width.
 */
@media (max-width: 768px) {
  .app {
    &__main {
      margin-left: 0;
    }
    
    &__content {
      padding: 1rem;
    }
  }
}
</style>
