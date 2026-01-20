<!--
  Dashboard View (Home Page)
  
  The main dashboard displaying statistics and overview information.
  This is the first page users see when they open the application.
  
  Demonstrates:
  - Fetching data from REST API
  - Using computed properties for derived data
  - Component composition
  - Reactive data updates
-->

<template>
  <div class="dashboard">
    <!-- Hero Banner -->
    <AemBanner
      eyebrow="Welcome to"
      title="AEM Dashboard Simulator"
      subtitle="Manage your content components and pages"
      description="This beginner-friendly project demonstrates Vue.js concepts including components, routing, API integration, and more."
      size="medium"
      alignment="left"
      primary-action="View Components"
      secondary-action="Create Page"
      @primary-click="navigateToComponents"
      @secondary-click="navigateToPages"
    />
    
    <!-- Statistics Section -->
    <AemBlock
      title="Dashboard Statistics"
      subtitle="Overview of your content management system"
      icon="📊"
      theme="primary"
    >
      <template #header-actions>
        <button class="refresh-btn" @click="fetchStatistics" :disabled="loading">
          🔄 Refresh
        </button>
      </template>
      
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" text="Loading statistics..." />
      
      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <span>❌</span>
        <p>{{ error }}</p>
        <button @click="fetchStatistics">Try Again</button>
      </div>
      
      <!-- Statistics Grid -->
      <div v-else class="stats-grid">
        <StatCard
          label="Total Components"
          :value="statistics.totalComponents"
          icon="🧩"
          :trend="12"
          description="Reusable UI components"
          variant="primary"
        />
        
        <StatCard
          label="Total Pages"
          :value="statistics.totalPages"
          icon="📄"
          :trend="8"
          description="Content pages created"
          variant="success"
        />
        
        <StatCard
          label="Published Pages"
          :value="statistics.publishedPages"
          icon="✅"
          :trend="5"
          description="Live on production"
          variant="success"
        />
        
        <StatCard
          label="Draft Pages"
          :value="statistics.draftPages"
          icon="📝"
          :trend="-2"
          description="Awaiting review"
          variant="warning"
        />
        
        <StatCard
          label="Active Users"
          :value="statistics.activeUsers"
          icon="👥"
          :trend="15"
          description="Content authors online"
          variant="primary"
        />
        
        <StatCard
          label="Last Updated"
          :value="formattedLastUpdate"
          icon="🕐"
          description="System sync time"
        />
      </div>
    </AemBlock>
    
    <!-- Recent Activity Section -->
    <AemBlock
      title="Recent Components"
      subtitle="Latest components added to the system"
      icon="🆕"
      layout="grid"
      :columns="3"
    >
      <template #header-actions>
        <router-link to="/components" class="view-all-link">
          View All →
        </router-link>
      </template>
      
      <LoadingSpinner v-if="componentsLoading" size="small" />
      
      <AemCard
        v-else
        v-for="component in recentComponents"
        :key="component.id"
        :title="component.name"
        :subtitle="component.type"
        :description="component.description"
        :badge="component.status"
        :badge-variant="component.status === 'published' ? 'success' : 'warning'"
        variant="outlined"
        clickable
        @click="viewComponent(component.id)"
      >
        <template #footer>
          <span class="component-author">By {{ component.author }}</span>
          <span class="component-date">{{ formatDate(component.createdAt) }}</span>
        </template>
      </AemCard>
    </AemBlock>
    
    <!-- Quick Actions Section -->
    <AemBlock
      title="Quick Actions"
      subtitle="Common tasks and shortcuts"
      icon="⚡"
    >
      <div class="quick-actions">
        <button class="quick-action" @click="navigateToComponents">
          <span class="quick-action__icon">➕</span>
          <span class="quick-action__text">Add Component</span>
        </button>
        
        <button class="quick-action" @click="navigateToPages">
          <span class="quick-action__icon">📄</span>
          <span class="quick-action__text">Create Page</span>
        </button>
        
        <button class="quick-action" @click="showJQueryDemo">
          <span class="quick-action__icon">✨</span>
          <span class="quick-action__text">jQuery Demo</span>
        </button>
        
        <button class="quick-action" @click="fetchStatistics">
          <span class="quick-action__icon">🔄</span>
          <span class="quick-action__text">Sync Data</span>
        </button>
      </div>
    </AemBlock>
    
    <!-- jQuery Demo Element (hidden by default) -->
    <div id="jquery-demo" class="jquery-demo" style="display: none;">
      <AemCard title="jQuery Animation Demo" variant="elevated">
        <p>This card was revealed using jQuery's slideDown animation!</p>
        <p>While Vue.js handles most DOM operations, jQuery can still be useful for specific animations and legacy integrations.</p>
        <template #actions>
          <button class="demo-btn" @click="hideJQueryDemo">Hide with jQuery</button>
        </template>
      </AemCard>
    </div>
  </div>
</template>

<script>
// Import our components
import AemBanner from '@/components/aem/AemBanner.vue'
import AemBlock from '@/components/aem/AemBlock.vue'
import AemCard from '@/components/aem/AemCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

// Import API service
import apiService from '@/services/api'

// Import helper utilities
import { formatDate, timeAgo, jQuerySlide } from '@/utils/helpers'

export default {
  name: 'DashboardView',
  
  // Register child components
  components: {
    AemBanner,
    AemBlock,
    AemCard,
    StatCard,
    LoadingSpinner
  },
  
  /**
   * Component Data
   * 
   * data() returns an object containing the component's reactive state.
   * When these values change, Vue automatically updates the DOM.
   */
  data() {
    return {
      // Statistics data from API
      statistics: {
        totalComponents: 0,
        totalPages: 0,
        publishedPages: 0,
        draftPages: 0,
        activeUsers: 0,
        lastUpdated: null
      },
      // Recent components list
      recentComponents: [],
      // Loading states
      loading: true,
      componentsLoading: true,
      // Error message
      error: null
    }
  },
  
  /**
   * Computed Properties
   * 
   * These are cached values that automatically update when their
   * dependencies change. Great for derived/calculated values.
   */
  computed: {
    /**
     * Format the last update time for display
     */
    formattedLastUpdate() {
      if (!this.statistics.lastUpdated) return 'Never'
      return timeAgo(this.statistics.lastUpdated)
    }
  },
  
  /**
   * Mounted Lifecycle Hook
   * 
   * Called after the component is mounted to the DOM.
   * This is a good place to fetch initial data.
   * 
   * BEGINNER TIP: Vue components have a lifecycle - they're created,
   * mounted to the DOM, updated, and eventually destroyed. Lifecycle
   * hooks let you run code at specific points in this cycle.
   */
  mounted() {
    // Fetch data when component is mounted
    this.fetchStatistics()
    this.fetchRecentComponents()
  },
  
  /**
   * Methods
   * 
   * Functions that can be called from the template or other methods.
   */
  methods: {
    /**
     * Fetch statistics from the API
     * 
     * This demonstrates async/await with API calls.
     */
    async fetchStatistics() {
      this.loading = true
      this.error = null
      
      try {
        // Make API request using our apiService
        const response = await apiService.statistics.get()
        
        // Update component state with response data
        this.statistics = response.data
        
        console.log('✅ Statistics loaded:', this.statistics)
      } catch (err) {
        // Handle errors gracefully
        this.error = 'Failed to load statistics. Make sure json-server is running.'
        console.error('❌ Error fetching statistics:', err)
      } finally {
        // Always set loading to false when done
        this.loading = false
      }
    },
    
    /**
     * Fetch recent components from the API
     */
    async fetchRecentComponents() {
      this.componentsLoading = true
      
      try {
        const response = await apiService.components.getAll()
        // Get the 3 most recent components
        this.recentComponents = response.data.slice(0, 3)
      } catch (err) {
        console.error('❌ Error fetching components:', err)
      } finally {
        this.componentsLoading = false
      }
    },
    
    /**
     * Format date using our helper utility
     */
    formatDate(date) {
      return formatDate(date)
    },
    
    /**
     * Navigate to components page
     * 
     * Uses Vue Router's programmatic navigation.
     */
    navigateToComponents() {
      this.$router.push('/components')
    },
    
    /**
     * Navigate to pages
     */
    navigateToPages() {
      this.$router.push('/pages')
    },
    
    /**
     * View a specific component
     */
    viewComponent(id) {
      this.$router.push(`/components/${id}`)
    },
    
    /**
     * Show jQuery demo - demonstrates jQuery integration
     */
    showJQueryDemo() {
      // Use our jQuery utility function
      jQuerySlide('#jquery-demo', 'down', 500)
    },
    
    /**
     * Hide jQuery demo
     */
    hideJQueryDemo() {
      jQuerySlide('#jquery-demo', 'up', 500)
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  // Stats grid layout
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  // Error message styling
  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
    color: @error-color;
    
    span {
      font-size: 2rem;
    }
    
    p {
      margin: 0;
      color: @text-secondary;
    }
    
    button {
      padding: 0.5rem 1rem;
      background: @primary-color;
      color: white;
      border: none;
      border-radius: @border-radius;
      cursor: pointer;
      
      &:hover {
        background: darken(@primary-color, 10%);
      }
    }
  }
  
  // Refresh button
  .refresh-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    color: @text-secondary;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: @background-color;
      color: @text-primary;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  // View all link
  .view-all-link {
    color: @primary-color;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  // Component card footer
  .component-author,
  .component-date {
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  // Quick actions grid
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .quick-action {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: @background-color;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: fade(@primary-color, 10%);
      border-color: @primary-color;
      transform: translateY(-2px);
    }
    
    &__icon {
      font-size: 1.5rem;
    }
    
    &__text {
      font-size: 0.9375rem;
      font-weight: 500;
      color: @text-primary;
    }
  }
  
  // jQuery demo section
  .jquery-demo {
    margin-top: 1.5rem;
  }
  
  .demo-btn {
    padding: 0.5rem 1rem;
    background: @primary-color;
    color: white;
    border: none;
    border-radius: @border-radius;
    cursor: pointer;
    
    &:hover {
      background: darken(@primary-color, 10%);
    }
  }
}
</style>
