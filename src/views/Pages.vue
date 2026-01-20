<!--
  Pages View
  
  Manages content pages that use AEM components.
  Demonstrates CRUD operations and component composition.
-->

<template>
  <div class="pages-view">
    <!-- Page Header -->
    <header class="page-header">
      <div class="page-header__content">
        <h1 class="page-header__title">📄 Content Pages</h1>
        <p class="page-header__description">
          Create and manage content pages using your AEM components.
          Each page can contain multiple components arranged in templates.
        </p>
      </div>
      
      <button class="btn btn--primary" @click="showCreateForm = true">
        ➕ Create Page
      </button>
    </header>
    
    <!-- Templates Overview -->
    <AemBlock title="Available Templates" icon="📐" layout="grid" :columns="3">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="template-card"
        :class="{ 'template-card--selected': selectedTemplate === template.name }"
        @click="selectTemplate(template)"
      >
        <span class="template-icon">
          {{ getTemplateIcon(template.name) }}
        </span>
        <h4 class="template-name">{{ template.displayName }}</h4>
        <p class="template-description">{{ template.description }}</p>
      </div>
    </AemBlock>
    
    <!-- Pages List -->
    <AemBlock
      :title="`Pages (${pages.length})`"
      icon="📚"
    >
      <template #header-actions>
        <div class="view-toggle">
          <button 
            class="view-btn"
            :class="{ 'view-btn--active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            ▦ Grid
          </button>
          <button 
            class="view-btn"
            :class="{ 'view-btn--active': viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            ☰ List
          </button>
        </div>
      </template>
      
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" text="Loading pages..." />
      
      <!-- Empty State -->
      <div v-else-if="pages.length === 0" class="empty-state">
        <span class="empty-state__icon">📭</span>
        <h3>No Pages Yet</h3>
        <p>Create your first content page to get started!</p>
        <button class="btn btn--primary" @click="showCreateForm = true">
          Create Your First Page
        </button>
      </div>
      
      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="pages-grid">
        <AemCard
          v-for="page in pages"
          :key="page.id"
          :title="page.title"
          :badge="page.status"
          :badge-variant="page.status === 'published' ? 'success' : 'warning'"
          variant="outlined"
          clickable
          @click="viewPage(page)"
        >
          <div class="page-info">
            <span class="page-template">
              {{ getTemplateIcon(page.template) }} {{ page.template }}
            </span>
            <span class="page-slug">/{{ page.slug }}</span>
            <span class="page-components">
              🧩 {{ page.components?.length || 0 }} components
            </span>
          </div>
          
          <template #footer>
            <span class="page-date">
              Last modified: {{ formatDate(page.lastModified) }}
            </span>
          </template>
          
          <template #actions>
            <button class="btn btn--small" @click.stop="editPage(page)">
              ✏️
            </button>
            <button class="btn btn--small btn--danger" @click.stop="deletePage(page)">
              🗑️
            </button>
          </template>
        </AemCard>
      </div>
      
      <!-- List View -->
      <div v-else class="pages-list">
        <table class="pages-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Template</th>
              <th>Components</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pages" :key="page.id">
              <td class="page-title-cell">
                <strong>{{ page.title }}</strong>
              </td>
              <td class="page-slug-cell">/{{ page.slug }}</td>
              <td>{{ getTemplateIcon(page.template) }} {{ page.template }}</td>
              <td>{{ page.components?.length || 0 }}</td>
              <td>
                <span 
                  class="status-badge"
                  :class="`status-badge--${page.status}`"
                >
                  {{ page.status }}
                </span>
              </td>
              <td>{{ formatDate(page.lastModified) }}</td>
              <td class="actions-cell">
                <button class="btn btn--small" @click="editPage(page)">✏️</button>
                <button class="btn btn--small btn--danger" @click="deletePage(page)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AemBlock>
    
    <!-- Page Preview Section -->
    <AemBlock 
      v-if="selectedPage" 
      :title="`Preview: ${selectedPage.title}`" 
      icon="👁️"
      theme="dark"
    >
      <template #header-actions>
        <button class="btn btn--secondary" @click="selectedPage = null">
          ✕ Close Preview
        </button>
      </template>
      
      <div class="page-preview">
        <div class="preview-header">
          <span class="preview-url">
            🌐 https://example.com/{{ selectedPage.slug }}
          </span>
        </div>
        
        <div class="preview-content">
          <p class="preview-info">
            This page uses the <strong>{{ selectedPage.template }}</strong> template
            with {{ selectedPage.components?.length || 0 }} components.
          </p>
          
          <div class="preview-components">
            <h4>Components on this page:</h4>
            <ul>
              <li v-for="compId in selectedPage.components" :key="compId">
                Component #{{ compId }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AemBlock>
    
    <!-- Create/Edit Page Modal -->
    <div v-if="showCreateForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <AemForm
          :title="editingPage ? 'Edit Page' : 'Create New Page'"
          description="Configure your content page settings."
          :fields="formFields"
          :initial-values="editingPage || { template: selectedTemplate }"
          :submit-text="editingPage ? 'Update Page' : 'Create Page'"
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
import { formatDate, slugify } from '@/utils/helpers'

export default {
  name: 'PagesView',
  
  components: {
    AemBlock,
    AemCard,
    AemForm,
    LoadingSpinner
  },
  
  data() {
    return {
      // Data
      pages: [],
      templates: [],
      loading: true,
      
      // UI State
      viewMode: 'grid',
      selectedTemplate: '',
      selectedPage: null,
      
      // Form State
      showCreateForm: false,
      editingPage: null,
      
      // Form configuration
      formFields: [
        {
          name: 'title',
          label: 'Page Title',
          type: 'text',
          placeholder: 'Enter page title',
          required: true,
          minLength: 3
        },
        {
          name: 'slug',
          label: 'URL Slug',
          type: 'text',
          placeholder: 'page-url-slug',
          required: true,
          help: 'URL-friendly identifier (e.g., "about-us")'
        },
        {
          name: 'template',
          label: 'Template',
          type: 'select',
          required: true,
          options: [
            { value: 'landing', label: 'Landing Page' },
            { value: 'content', label: 'Content Page' },
            { value: 'form', label: 'Form Page' }
          ]
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
  
  mounted() {
    this.fetchPages()
    this.fetchTemplates()
  },
  
  methods: {
    /**
     * Fetch all pages
     */
    async fetchPages() {
      this.loading = true
      
      try {
        const response = await apiService.pages.getAll()
        this.pages = response.data
      } catch (error) {
        console.error('Failed to fetch pages:', error)
      } finally {
        this.loading = false
      }
    },
    
    /**
     * Fetch available templates
     */
    async fetchTemplates() {
      try {
        const response = await apiService.templates.getAll()
        this.templates = response.data
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      }
    },
    
    /**
     * Get icon for template type
     */
    getTemplateIcon(template) {
      const icons = {
        landing: '🚀',
        content: '📝',
        form: '📋'
      }
      return icons[template] || '📄'
    },
    
    /**
     * Format date
     */
    formatDate(date) {
      return formatDate(date)
    },
    
    /**
     * Select a template
     */
    selectTemplate(template) {
      this.selectedTemplate = template.name
    },
    
    /**
     * View page details/preview
     */
    viewPage(page) {
      this.selectedPage = page
    },
    
    /**
     * Edit page
     */
    editPage(page) {
      this.editingPage = { ...page }
      this.showCreateForm = true
    },
    
    /**
     * Delete page
     */
    async deletePage(page) {
      if (!confirm(`Are you sure you want to delete "${page.title}"?`)) {
        return
      }
      
      try {
        await apiService.pages.delete(page.id)
        this.pages = this.pages.filter(p => p.id !== page.id)
        
        if (this.selectedPage?.id === page.id) {
          this.selectedPage = null
        }
        
        console.log('✅ Page deleted successfully')
      } catch (error) {
        console.error('Failed to delete page:', error)
        alert('Failed to delete page. Please try again.')
      }
    },
    
    /**
     * Handle form submission
     */
    async handleFormSubmit(formData) {
      try {
        // Auto-generate slug if not provided
        if (!formData.slug) {
          formData.slug = slugify(formData.title)
        }
        
        if (this.editingPage) {
          // Update existing page
          const response = await apiService.pages.update(this.editingPage.id, {
            ...formData,
            components: this.editingPage.components,
            lastModified: new Date().toISOString()
          })
          
          const index = this.pages.findIndex(p => p.id === this.editingPage.id)
          if (index !== -1) {
            this.pages[index] = response.data
          }
          
          console.log('✅ Page updated successfully')
        } else {
          // Create new page
          const newPage = {
            ...formData,
            components: [],
            lastModified: new Date().toISOString()
          }
          
          const response = await apiService.pages.create(newPage)
          this.pages.push(response.data)
          
          console.log('✅ Page created successfully')
        }
        
        this.closeForm()
      } catch (error) {
        console.error('Failed to save page:', error)
        throw new Error('Failed to save page. Please try again.')
      }
    },
    
    /**
     * Close form modal
     */
    closeForm() {
      this.showCreateForm = false
      this.editingPage = null
    }
  }
}
</script>

<style lang="less" scoped>
.pages-view {
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
  
  // Template cards
  .template-card {
    padding: 1.5rem;
    background: @background-color;
    border: 2px solid @border-color;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    
    &:hover {
      border-color: @primary-color;
      transform: translateY(-2px);
    }
    
    &--selected {
      border-color: @primary-color;
      background: fade(@primary-color, 10%);
    }
  }
  
  .template-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }
  
  .template-name {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: @text-primary;
  }
  
  .template-description {
    margin: 0;
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  // View toggle
  .view-toggle {
    display: flex;
    gap: 0.5rem;
  }
  
  .view-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    color: @text-secondary;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: @background-color;
    }
    
    &--active {
      background: @primary-color;
      color: white;
      border-color: @primary-color;
    }
  }
  
  // Empty state
  .empty-state {
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
  
  // Pages grid
  .pages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .page-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  
  .page-template {
    color: @text-secondary;
  }
  
  .page-slug {
    font-family: monospace;
    color: @primary-color;
  }
  
  .page-components {
    color: @text-secondary;
  }
  
  .page-date {
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  // Pages table (list view)
  .pages-table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid @border-color;
    }
    
    th {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: @text-secondary;
      background: @background-color;
    }
    
    td {
      color: @text-primary;
    }
    
    tr:hover td {
      background: fade(@primary-color, 5%);
    }
  }
  
  .page-title-cell strong {
    color: @text-primary;
  }
  
  .page-slug-cell {
    font-family: monospace;
    color: @primary-color;
  }
  
  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }
  
  .status-badge {
    display: inline-block;
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
  
  // Page preview
  .page-preview {
    background: @background-color;
    border-radius: @border-radius;
    overflow: hidden;
  }
  
  .preview-header {
    padding: 0.75rem 1rem;
    background: darken(@background-color, 3%);
    border-bottom: 1px solid @border-color;
  }
  
  .preview-url {
    font-family: monospace;
    font-size: 0.875rem;
    color: @text-secondary;
  }
  
  .preview-content {
    padding: 1.5rem;
  }
  
  .preview-info {
    margin: 0 0 1.5rem;
    color: @text-secondary;
    
    strong {
      color: @text-primary;
    }
  }
  
  .preview-components {
    h4 {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      color: @text-primary;
    }
    
    ul {
      margin: 0;
      padding-left: 1.5rem;
      color: @text-secondary;
    }
    
    li {
      margin-bottom: 0.25rem;
    }
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
      
      &:hover {
        background: @background-color;
        color: @text-primary;
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
