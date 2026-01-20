<!--
  App Navigation Component
  
  The main navigation sidebar for the application.
  Uses Vue Router's router-link for navigation.
  
  BEGINNER TIP: router-link is a Vue Router component that renders
  an anchor tag that triggers navigation without page reload.
-->

<template>
  <nav class="app-nav">
    <!-- Logo/Brand Section -->
    <div class="app-nav__brand">
      <span class="app-nav__logo">🎨</span>
      <div class="app-nav__brand-text">
        <h1 class="app-nav__title">AEM Dashboard</h1>
        <span class="app-nav__subtitle">Simulator</span>
      </div>
    </div>
    
    <!-- Navigation Links -->
    <ul class="app-nav__menu">
      <!-- 
        v-for loops through our routes
        router-link creates navigation links
        The 'active-class' prop adds a class when the route is active
      -->
      <li 
        v-for="route in navRoutes" 
        :key="route.path"
        class="app-nav__item"
      >
        <router-link 
          :to="route.path"
          class="app-nav__link"
          active-class="app-nav__link--active"
        >
          <span class="app-nav__icon">{{ route.meta?.icon || '📄' }}</span>
          <span class="app-nav__text">{{ route.meta?.title || route.name }}</span>
        </router-link>
      </li>
    </ul>
    
    <!-- Bottom Section -->
    <div class="app-nav__footer">
      <div class="app-nav__user">
        <div class="app-nav__avatar">👤</div>
        <div class="app-nav__user-info">
          <span class="app-nav__user-name">Admin User</span>
          <span class="app-nav__user-role">Content Author</span>
        </div>
      </div>
      
      <!-- Version Info -->
      <div class="app-nav__version">
        <span>v1.0.0</span>
        <span class="app-nav__status">● Online</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavigation',
  
  computed: {
    /**
     * Get navigation routes from Vue Router
     * 
     * We filter out routes that shouldn't appear in navigation
     * (like detail pages with parameters)
     */
    navRoutes() {
      return this.$router.options.routes.filter(route => {
        // Exclude redirect routes and routes with parameters
        return route.path !== '/' && !route.path.includes(':')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-nav {
  width: 280px;
  min-height: 100vh;
  background: @surface-color;
  border-right: 1px solid @border-color;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  
  &__brand {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid @border-color;
  }
  
  &__logo {
    font-size: 2.5rem;
    line-height: 1;
  }
  
  &__brand-text {
    display: flex;
    flex-direction: column;
  }
  
  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: @text-primary;
    line-height: 1.2;
  }
  
  &__subtitle {
    font-size: 0.75rem;
    color: @text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  &__menu {
    list-style: none;
    margin: 0;
    padding: 1rem 0;
    flex: 1;
  }
  
  &__item {
    margin: 0.25rem 0.75rem;
  }
  
  &__link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: @border-radius;
    color: @text-secondary;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background: fade(@primary-color, 10%);
      color: @text-primary;
    }
    
    &--active {
      background: fade(@primary-color, 15%);
      color: @primary-color;
      font-weight: 500;
      
      .app-nav__icon {
        transform: scale(1.1);
      }
    }
  }
  
  &__icon {
    font-size: 1.25rem;
    transition: transform 0.2s ease;
  }
  
  &__text {
    font-size: 0.9375rem;
  }
  
  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid @border-color;
  }
  
  &__user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: @background-color;
    border-radius: @border-radius;
    margin-bottom: 1rem;
  }
  
  &__avatar {
    width: 40px;
    height: 40px;
    background: fade(@primary-color, 20%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  
  &__user-info {
    display: flex;
    flex-direction: column;
  }
  
  &__user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: @text-primary;
  }
  
  &__user-role {
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  &__version {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  &__status {
    color: @success-color;
  }
}

// Responsive: Hide sidebar on mobile
@media (max-width: 768px) {
  .app-nav {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &--open {
      transform: translateX(0);
    }
  }
}
</style>
