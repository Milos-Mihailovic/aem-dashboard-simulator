<!--
  Component Detail View
  
  Shows detailed information about a single component.
  Demonstrates route parameters and dynamic data loading.
-->

<template>
  <div class="component-detail">
    <!-- Back Navigation -->
    <button class="back-btn" @click="goBack">
      ← Back to Components
    </button>
    
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading component details..." />
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">❌</span>
      <h2>Component Not Found</h2>
      <p>{{ error }}</p>
      <button class="btn btn--primary" @click="goBack">
        Return to Components
      </button>
    </div>
    
    <!-- Component Details -->
    <template v-else-if="component">
      <!-- Header Section -->
      <AemBanner
        :eyebrow="component.type"
        :title="component.name"
        :description="component.description"
        size="small"
        alignment="left"
      >
        <div class="component-status">
          <span 
            class="status-badge"
            :class="`status-badge--${component.status}`"
          >
            {{ component.status }}
          </span>
        </div>
      </AemBanner>
      
      <!-- Details Block -->
      <AemBlock title="Component Information" icon="ℹ️">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Type</span>
            <span class="info-value">{{ getTypeIcon(component.type) }} {{ component.type }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Author</span>
            <span class="info-value">👤 {{ component.author }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Created</span>
            <span class="info-value">📅 {{ formatDate(component.createdAt) }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">
              {{ component.status === 'published' ? '✅' : '📝' }} 
              {{ component.status }}
            </span>
          </div>
          
          <div class="info-item info-item--full">
            <span class="info-label">Description</span>
            <span class="info-value">{{ component.description }}</span>
          </div>
        </div>
      </AemBlock>
      
      <!-- Preview Block -->
      <AemBlock title="Component Preview" icon="👁️" theme="dark">
        <div class="preview-container">
          <!-- Dynamic component preview based on type -->
          <div class="preview-box">
            <AemCard
              v-if="component.type === 'card'"
              title="Sample Card"
              description="This is a preview of how the card component looks."
              badge="Preview"
              badge-variant="primary"
              variant="elevated"
            />
            
            <AemBanner
              v-else-if="component.type === 'banner'"
              title="Sample Banner"
              subtitle="This is a preview of the banner component"
              size="small"
            />
            
            <AemForm
              v-else-if="component.type === 'form'"
              title="Sample Form"
              :fields="sampleFormFields"
              :show-cancel="false"
              submit-text="Preview Submit"
            />
            
            <div v-else class="generic-preview">
              <span class="preview-icon">{{ getTypeIcon(component.type) }}</span>
              <p>Preview for {{ component.type }} component</p>
            </div>
          </div>
        </div>
      </AemBlock>
      
      <!-- Usage Example Block -->
      <AemBlock title="Usage Example" icon="💻">
        <div class="code-block">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
        <p class="code-note">
          💡 Copy this code snippet to use the component in your Vue.js application.
        </p>
      </AemBlock>
      
      <!-- Actions -->
      <div class="actions">
        <button class="btn btn--secondary" @click="goBack">
          ← Back
        </button>
        <button class="btn btn--primary" @click="editComponent">
          ✏️ Edit Component
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import AemBanner from '@/components/aem/AemBanner.vue'
import AemBlock from '@/components/aem/AemBlock.vue'
import AemCard from '@/components/aem/AemCard.vue'
import AemForm from '@/components/aem/AemForm.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import apiService from '@/services/api'
import { formatDate } from '@/utils/helpers'

export default {
  name: 'ComponentDetailView',
  
  components: {
    AemBanner,
    AemBlock,
    AemCard,
    AemForm,
    LoadingSpinner
  },
  
  /**
   * Props from Route
   * 
   * When props: true is set in the route config, route params
   * are passed as props to the component.
   */
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  
  data() {
    return {
      component: null,
      loading: true,
      error: null,
      
      // Sample form fields for preview
      sampleFormFields: [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' }
      ]
    }
  },
  
  computed: {
    /**
     * Generate usage example code
     */
    usageExample() {
      if (!this.component) return ''
      
      const examples = {
        card: `<AemCard
  title="Your Title"
  description="Your description here"
  badge="Status"
  badge-variant="success"
  variant="outlined"
  clickable
  @click="handleClick"
/>`,
        banner: `<AemBanner
  eyebrow="Category"
  title="Your Banner Title"
  subtitle="Subtitle text"
  description="Description paragraph"
  size="medium"
  alignment="center"
  primary-action="Get Started"
  @primary-click="handleAction"
/>`,
        form: `<AemForm
  title="Form Title"
  description="Form description"
  :fields="formFields"
  submit-text="Submit"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>`,
        navigation: `<AppNavigation
  :routes="routes"
  :current-route="currentRoute"
  @navigate="handleNavigation"
/>`
      }
      
      return examples[this.component.type] || `<!-- ${this.component.name} component -->`
    }
  },
  
  /**
   * Watch for route changes
   * 
   * If the user navigates to a different component detail page,
   * we need to fetch the new component data.
   */
  watch: {
    id: {
      immediate: true,
      handler(newId) {
        this.fetchComponent(newId)
      }
    }
  },
  
  methods: {
    /**
     * Fetch component by ID
     */
    async fetchComponent(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.components.getById(id)
        this.component = response.data
      } catch (err) {
        this.error = 'Could not find the requested component.'
        console.error('Error fetching component:', err)
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
     * Format date
     */
    formatDate(date) {
      return formatDate(date)
    },
    
    /**
     * Navigate back to components list
     */
    goBack() {
      this.$router.push('/components')
    },
    
    /**
     * Navigate to edit (would open edit modal on components page)
     */
    editComponent() {
      // In a real app, you might open an edit modal or navigate to an edit page
      this.$router.push('/components')
    }
  }
}
</script>

<style lang="less" scoped>
.component-detail {
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    margin-bottom: 1.5rem;
    background: transparent;
    color: @text-secondary;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: @surface-color;
      color: @text-primary;
    }
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem;
    text-align: center;
    
    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    h2 {
      margin: 0 0 0.5rem;
      color: @text-primary;
    }
    
    p {
      margin: 0 0 1.5rem;
      color: @text-secondary;
    }
  }
  
  .component-status {
    margin-top: 1rem;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
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
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    &--full {
      grid-column: 1 / -1;
    }
  }
  
  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: @text-secondary;
  }
  
  .info-value {
    font-size: 1rem;
    color: @text-primary;
  }
  
  .preview-container {
    padding: 2rem;
    background: @background-color;
    border-radius: @border-radius;
    border: 1px dashed @border-color;
  }
  
  .preview-box {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .generic-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    text-align: center;
    
    .preview-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    p {
      margin: 0;
      color: @text-secondary;
    }
  }
  
  .code-block {
    background: @background-color;
    border-radius: @border-radius;
    padding: 1.5rem;
    overflow-x: auto;
    
    pre {
      margin: 0;
    }
    
    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.875rem;
      color: @text-primary;
      line-height: 1.6;
    }
  }
  
  .code-note {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    color: @text-secondary;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid @border-color;
  }
  
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
      
      &:hover {
        background: @surface-color;
        color: @text-primary;
      }
    }
  }
}
</style>
