<!--
  Components View
  
  Displays all AEM-style components in the system.
  Users can view, filter, and add new components.
  
  Demonstrates:
  - List rendering with v-for
  - Filtering and searching
  - Form handling for creating new items
  - Props and events communication
-->

<template>
  <div class="components-view">
    <!-- Page Header -->
    <header class="page-header">
      <div class="page-header__content">
        <h1 class="page-header__title">🧩 AEM Components</h1>
        <p class="page-header__description">
          Manage and create reusable UI components for your content pages.
          Components are the building blocks of your AEM experience.
        </p>
      </div>
      
      <button class="btn btn--primary" @click="showCreateForm = true">
        ➕ Add Component
      </button>
    </header>
    
    <!-- Filters Section -->
    <AemBlock title="Filter Components" icon="🔍">
      <div class="filters">
        <!-- Search Input -->
        <div class="filter-group">
          <label for="search">Search</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search by name or description..."
            class="filter-input"
          />
        </div>
        
        <!-- Type Filter -->
        <div class="filter-group">
          <label for="type">Type</label>
          <select id="type" v-model="filterType" class="filter-select">
            <option value="">All Types</option>
            <option value="banner">Banner</option>
            <option value="card">Card</option>
            <option value="form">Form</option>
            <option value="navigation">Navigation</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div class="filter-group">
          <label for="status">Status</label>
          <select id="status" v-model="filterStatus" class="filter-select">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <!-- Clear Filters -->
        <button 
          class="btn btn--secondary" 
          @click="clearFilters"
          :disabled="!hasActiveFilters"
        >
          Clear Filters
        </button>
      </div>
    </AemBlock>
    
    <!-- Components List -->
    <AemBlock
      :title="`Components (${filteredComponents.length})`"
      icon="📦"
      layout="grid"
      :columns="3"
      gap="medium"
    >
      <template #header-actions>
        <span class="results-count">
          Showing {{ filteredComponents.length }} of {{ components.length }}
        </span>
      </template>
      
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" text="Loading components..." />
      
      <!-- Empty State -->
      <div v-else-if="filteredComponents.length === 0" class="empty-state">
        <span class="empty-state__icon">📭</span>
        <h3>No Components Found</h3>
        <p v-if="hasActiveFilters">
          Try adjusting your filters or search query.
        </p>
        <p v-else>
          Get started by creating your first component!
        </p>
        <button class="btn btn--primary" @click="showCreateForm = true">
          Create Component
        </button>
      </div>
      
      <!-- Component Cards -->
      <AemCard
        v-else
        v-for="component in filteredComponents"
        :key="component.id"
        :title="component.name"
        :description="component.description"
        :badge="component.status"
        :badge-variant="component.status === 'published' ? 'success' : 'warning'"
        variant="outlined"
        clickable
        @click="viewComponent(component)"
      >
        <template #header>
          <div class="component-header">
            <span class="component-type">{{ getTypeIcon(component.type) }} {{ component.type }}</span>
            <h3 class="component-name">{{ component.name }}</h3>
          </div>
          <span 
            class="component-badge"
            :class="`component-badge--${component.status}`"
          >
            {{ component.status }}
          </span>
        </template>
        
        <template #footer>
          <div class="component-meta">
            <span>👤 {{ component.author }}</span>
            <span>📅 {{ formatDate(component.createdAt) }}</span>
          </div>
        </template>
        
        <template #actions>
          <button class="btn btn--small" @click.stop="editComponent(component)">
            ✏️ Edit
          </button>
          <button class="btn btn--small btn--danger" @click.stop="deleteComponent(component)">
            🗑️ Delete
          </button>
        </template>
      </AemCard>
    </AemBlock>
    
    <!-- Create/Edit Component Modal -->
    <div v-if="showCreateForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <AemForm
          :title="editingComponent ? 'Edit Component' : 'Create New Component'"
          description="Fill in the details below to create a reusable AEM component."
          :fields="formFields"
          :initial-values="editingComponent || {}"
          :submit-text="editingComponent ? 'Update Component' : 'Create Component'"
          @submit="handleFormSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AemBlock from '@/components/aem/AemBlock.vue'
import AemCard from '@/components/aem/AemCard.vue'
import AemForm from '@/components/aem/AemForm.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import apiService from '@/services/api'
import { formatDate, filterBySearch, debounce } from '@/utils/helpers'

export default {
  name: 'ComponentsView',
  
  components: {
    AemBlock,
    AemCard,
    AemForm,
    LoadingSpinner
  },
  
  data() {
    return {
      // Components data
      components: [],
      loading: true,
      
      // Filter state
      searchQuery: '',
      filterType: '',
      filterStatus: '',
      
      // Form state
      showCreateForm: false,
      editingComponent: null,
      
      // Form field configuration
      formFields: [
        {
          name: 'name',
          label: 'Component Name',
          type: 'text',
          placeholder: 'Enter component name',
          required: true,
          minLength: 3
        },
        {
          name: 'type',
          label: 'Component Type',
          type: 'select',
          required: true,
          options: [
            { value: 'banner', label: 'Banner' },
            { value: 'card', label: 'Card' },
            { value: 'form', label: 'Form' },
            { value: 'navigation', label: 'Navigation' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Describe what this component does...',
          required: true,
          fullWidth: true
        },
        {
          name: 'author',
          label: 'Author',
          type: 'text',
          placeholder: 'Your name',
          required: true
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' }
          ]
        }
      ]
    }
  },
  
  computed: {
    /**
     * Filter components based on search and filter criteria
     * 
     * This computed property automatically updates when any of its
     * dependencies (searchQuery, filterType, filterStatus, components) change.
     */
    filteredComponents() {
      let result = [...this.components]
      
      // Apply search filter
      if (this.searchQuery) {
        result = filterBySearch(result, this.searchQuery, ['name', 'description', 'author'])
      }
      
      // Apply type filter
      if (this.filterType) {
        result = result.filter(c => c.type === this.filterType)
      }
      
      // Apply status filter
      if (this.filterStatus) {
        result = result.filter(c => c.status === this.filterStatus)
      }
      
      return result
    },
    
    /**
     * Check if any filters are active
     */
    hasActiveFilters() {
      return this.searchQuery || this.filterType || this.filterStatus
    }
  },
  
  /**
   * Created Hook
   * 
   * Set up debounced search to avoid too many filter operations
   */
  created() {
    // Create a debounced version of the search
    // This prevents filtering on every keystroke
    this.debouncedSearch = debounce((value) => {
      this.searchQuery = value
    }, 300)
  },
  
  mounted() {
    this.fetchComponents()
  },
  
  methods: {
    /**
     * Fetch all components from API
     */
    async fetchComponents() {
      this.loading = true
      
      try {
        const response = await apiService.components.getAll()
        this.components = response.data
      } catch (error) {
        console.error('Failed to fetch components:', error)
      } finally {
        this.loading = false
      }
    },
    
    /**
     * Get icon for component type
     */
    getTypeIcon(type) {
      const icons = {
        banner: '🎨',
        card: '🃏',
        form: '📝',
        navigation: '🧭'
      }
      return icons[type] || '📦'
    },
    
    /**
     * Format date helper
     */
    formatDate(date) {
      return formatDate(date)
    },
    
    /**
     * Clear all filters
     */
    clearFilters() {
      this.searchQuery = ''
      this.filterType = ''
      this.filterStatus = ''
    },
    
    /**
     * View component details
     */
    viewComponent(component) {
      this.$router.push(`/components/${component.id}`)
    },
    
    /**
     * Edit component
     */
    editComponent(component) {
      this.editingComponent = { ...component }
      this.showCreateForm = true
    },
    
    /**
     * Delete component
     */
    async deleteComponent(component) {
      if (!confirm(`Are you sure you want to delete "${component.name}"?`)) {
        return
      }
      
      try {
        await apiService.components.delete(component.id)
        // Remove from local state
        this.components = this.components.filter(c => c.id !== component.id)
        console.log('✅ Component deleted successfully')
      } catch (error) {
        console.error('Failed to delete component:', error)
        alert('Failed to delete component. Please try again.')
      }
    },
    
    /**
     * Handle form submission (create or update)
     */
    async handleFormSubmit(formData) {
      try {
        if (this.editingComponent) {
          // Update existing component
          const response = await apiService.components.update(this.editingComponent.id, {
            ...formData,
            createdAt: this.editingComponent.createdAt
          })
          
          // Update in local state
          const index = this.components.findIndex(c => c.id === this.editingComponent.id)
          if (index !== -1) {
            this.components[index] = response.data
          }
          
          console.log('✅ Component updated successfully')
        } else {
          // Create new component
          const newComponent = {
            ...formData,
            createdAt: new Date().toISOString()
          }
          
          const response = await apiService.components.create(newComponent)
          this.components.push(response.data)
          
          console.log('✅ Component created successfully')
        }
        
        this.closeForm()
      } catch (error) {
        console.error('Failed to save component:', error)
        throw new Error('Failed to save component. Please try again.')
      }
    },
    
    /**
     * Close the form modal
     */
    closeForm() {
      this.showCreateForm = false
      this.editingComponent = null
    }
  }
}
</script>

<style lang="less" scoped>
.components-view {
  // Page header
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid @border-color;
    
    &__title {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      color: @text-primary;
    }
    
    &__description {
      margin: 0;
      color: @text-secondary;
      max-width: 600px;
      line-height: 1.6;
    }
  }
  
  // Filters
  .filters {
    display: flex;
    gap: 1.5rem;
    align-items: flex-end;
    flex-wrap: wrap;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;
    
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: @text-secondary;
    }
  }
  
  .filter-input,
  .filter-select {
    padding: 0.75rem 1rem;
    background: @background-color;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    color: @text-primary;
    font-size: 0.9375rem;
    
    &:focus {
      outline: none;
      border-color: @primary-color;
    }
  }
  
  .filter-select {
    cursor: pointer;
  }
  
  // Results count
  .results-count {
    font-size: 0.875rem;
    color: @text-secondary;
  }
  
  // Empty state
  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem;
    text-align: center;
    
    &__icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    h3 {
      margin: 0 0 0.5rem;
      color: @text-primary;
    }
    
    p {
      margin: 0 0 1.5rem;
      color: @text-secondary;
    }
  }
  
  // Component card customizations
  .component-header {
    flex: 1;
  }
  
  .component-type {
    font-size: 0.75rem;
    color: @text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .component-name {
    margin: 0.25rem 0 0;
    font-size: 1.125rem;
    color: @text-primary;
  }
  
  .component-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    
    &--published {
      background: fade(@success-color, 20%);
      color: @success-color;
    }
    
    &--draft {
      background: fade(@warning-color, 20%);
      color: darken(@warning-color, 10%);
    }
  }
  
  .component-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  // Buttons
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &--primary {
      background: @primary-color;
      color: white;
      border: none;
      
      &:hover {
        background: darken(@primary-color, 10%);
      }
    }
    
    &--secondary {
      background: transparent;
      color: @text-secondary;
      border: 1px solid @border-color;
      
      &:hover:not(:disabled) {
        background: @background-color;
        color: @text-primary;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    &--small {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }
    
    &--danger {
      color: @error-color;
      
      &:hover {
        background: fade(@error-color, 10%);
      }
    }
  }
  
  // Modal
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }
  
  .modal {
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalIn 0.3s ease;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
