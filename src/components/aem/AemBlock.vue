<!--
  AEM Block Component
  
  This component represents a content block similar to AEM's content fragments.
  It's a flexible container that can hold various types of content.
  
  Key Vue.js concepts demonstrated:
  - Dynamic components with :is
  - Conditional rendering with v-if/v-else
  - Slot props for passing data to slot content
  - Computed properties for derived state
-->

<template>
  <section 
    class="aem-block"
    :class="[
      `aem-block--${layout}`,
      `aem-block--${theme}`,
      { 'aem-block--full-width': fullWidth }
    ]"
  >
    <!-- Block Header (optional) -->
    <header v-if="title || $slots.header" class="aem-block__header">
      <slot name="header">
        <div class="aem-block__header-content">
          <!-- Icon (optional) -->
          <span v-if="icon" class="aem-block__icon">{{ icon }}</span>
          
          <div class="aem-block__titles">
            <h2 class="aem-block__title">{{ title }}</h2>
            <p v-if="subtitle" class="aem-block__subtitle">{{ subtitle }}</p>
          </div>
        </div>
        
        <!-- Header Actions Slot -->
        <div v-if="$slots['header-actions']" class="aem-block__header-actions">
          <slot name="header-actions"></slot>
        </div>
      </slot>
    </header>
    
    <!-- Block Content -->
    <div class="aem-block__content" :class="contentClasses">
      <!-- 
        Scoped Slot with Props
        
        We pass data to the slot so parent components can access it.
        This is useful when the parent needs information from the child.
      -->
      <slot :layout="layout" :theme="theme">
        <!-- Default content placeholder -->
        <div class="aem-block__placeholder">
          <span class="aem-block__placeholder-icon">📦</span>
          <p>Drop content here or use the default slot</p>
        </div>
      </slot>
    </div>
    
    <!-- Block Footer (optional) -->
    <footer v-if="$slots.footer" class="aem-block__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'AemBlock',
  
  props: {
    // Block title
    title: {
      type: String,
      default: ''
    },
    // Block subtitle
    subtitle: {
      type: String,
      default: ''
    },
    // Icon emoji or character
    icon: {
      type: String,
      default: ''
    },
    // Layout type affects content arrangement
    layout: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'grid', 'list', 'masonry'].includes(value)
    },
    // Theme affects colors
    theme: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'dark', 'light'].includes(value)
    },
    // Whether block spans full width
    fullWidth: {
      type: Boolean,
      default: false
    },
    // Number of columns for grid layout
    columns: {
      type: Number,
      default: 3,
      validator: (value) => value >= 1 && value <= 6
    },
    // Gap between items
    gap: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  
  /**
   * Computed Properties
   * 
   * Computed properties are cached based on their reactive dependencies.
   * They only re-evaluate when their dependencies change.
   * 
   * BEGINNER TIP: Use computed properties when you need to derive
   * new values from existing data. They're more efficient than methods
   * for values that are used multiple times in the template.
   */
  computed: {
    // Generate CSS classes for content based on props
    contentClasses() {
      return {
        [`aem-block__content--${this.layout}`]: true,
        [`aem-block__content--gap-${this.gap}`]: true,
        [`aem-block__content--cols-${this.columns}`]: this.layout === 'grid'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.aem-block {
  background: @surface-color;
  border-radius: @border-radius;
  border: 1px solid @border-color;
  margin-bottom: 1.5rem;
  
  &__header {
    padding: 1.5rem;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  &__header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__icon {
    font-size: 2rem;
    line-height: 1;
  }
  
  &__titles {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: @text-primary;
  }
  
  &__subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: @text-secondary;
  }
  
  &__header-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  &__content {
    padding: 1.5rem;
    
    // Layout variants
    &--grid {
      display: grid;
      
      // Dynamic columns using CSS custom properties
      &.aem-block__content--cols-1 { grid-template-columns: 1fr; }
      &.aem-block__content--cols-2 { grid-template-columns: repeat(2, 1fr); }
      &.aem-block__content--cols-3 { grid-template-columns: repeat(3, 1fr); }
      &.aem-block__content--cols-4 { grid-template-columns: repeat(4, 1fr); }
      &.aem-block__content--cols-5 { grid-template-columns: repeat(5, 1fr); }
      &.aem-block__content--cols-6 { grid-template-columns: repeat(6, 1fr); }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr !important;
      }
    }
    
    &--list {
      display: flex;
      flex-direction: column;
    }
    
    &--masonry {
      column-count: 3;
      column-gap: 1.5rem;
      
      @media (max-width: 768px) {
        column-count: 1;
      }
    }
    
    // Gap variants
    &--gap-small { gap: 0.75rem; }
    &--gap-medium { gap: 1.5rem; }
    &--gap-large { gap: 2rem; }
  }
  
  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    border: 2px dashed @border-color;
    border-radius: @border-radius;
    color: @text-secondary;
    text-align: center;
  }
  
  &__placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid @border-color;
    background: fade(@background-color, 50%);
  }
  
  // Theme variants
  &--primary {
    border-color: @primary-color;
    
    .aem-block__header {
      background: fade(@primary-color, 10%);
      border-bottom-color: fade(@primary-color, 30%);
    }
    
    .aem-block__title {
      color: @primary-color;
    }
  }
  
  &--dark {
    background: @background-color;
    
    .aem-block__header {
      background: darken(@background-color, 3%);
    }
  }
  
  &--light {
    background: lighten(@surface-color, 5%);
    
    .aem-block__header {
      background: lighten(@surface-color, 8%);
    }
  }
  
  // Full width variant
  &--full-width {
    border-radius: 0;
    border-left: none;
    border-right: none;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    width: calc(100% + 3rem);
  }
}
</style>
