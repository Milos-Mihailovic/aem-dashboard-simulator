<!--
  AEM Card Component
  
  This is a reusable card component that mimics AEM's card-based content blocks.
  It demonstrates several Vue.js concepts:
  - Props: For passing data from parent to child
  - Slots: For flexible content injection
  - Emits: For child-to-parent communication
  - Scoped styles: For component-specific styling
  
  BEGINNER TIP: Cards are one of the most common UI patterns. They group
  related information together in a visually distinct container.
-->

<template>
  <!-- 
    The main card container
    :class binding allows dynamic class application based on props
  -->
  <div 
    class="aem-card" 
    :class="[
      `aem-card--${variant}`,
      { 'aem-card--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <!-- Card Header Section -->
    <!-- v-if only renders this section if we have header content -->
    <div v-if="$slots.header || title" class="aem-card__header">
      <!-- 
        Named Slot: header
        Slots allow parent components to inject custom content.
        If no slot content is provided, we fall back to the title prop.
      -->
      <slot name="header">
        <h3 class="aem-card__title">{{ title }}</h3>
        <span v-if="subtitle" class="aem-card__subtitle">{{ subtitle }}</span>
      </slot>
      
      <!-- Badge for status indication -->
      <span 
        v-if="badge" 
        class="aem-card__badge"
        :class="`aem-card__badge--${badgeVariant}`"
      >
        {{ badge }}
      </span>
    </div>
    
    <!-- Card Image Section (optional) -->
    <div v-if="image" class="aem-card__image">
      <img :src="image" :alt="title || 'Card image'" />
    </div>
    
    <!-- Card Body Section -->
    <div class="aem-card__body">
      <!-- 
        Default Slot
        This is where the main content goes.
        Parent components can put any content here.
      -->
      <slot>
        <!-- Default content if no slot content provided -->
        <p v-if="description" class="aem-card__description">
          {{ description }}
        </p>
      </slot>
    </div>
    
    <!-- Card Footer Section -->
    <div v-if="$slots.footer || $slots.actions" class="aem-card__footer">
      <!-- Named Slot: footer -->
      <slot name="footer"></slot>
      
      <!-- Named Slot: actions (for buttons, links, etc.) -->
      <div v-if="$slots.actions" class="aem-card__actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * AemCard Component Script
 * 
 * This section defines the component's logic, props, and events.
 */
export default {
  // Component name - useful for debugging and recursive components
  name: 'AemCard',
  
  /**
   * Props Definition
   * 
   * Props are custom attributes you can register on a component.
   * When a value is passed to a prop attribute, it becomes a property
   * on that component instance.
   * 
   * BEGINNER TIP: Think of props as function parameters for components.
   */
  props: {
    // Card title - displayed in the header
    title: {
      type: String,
      default: ''
    },
    // Card subtitle - smaller text below title
    subtitle: {
      type: String,
      default: ''
    },
    // Card description - main text content
    description: {
      type: String,
      default: ''
    },
    // Image URL for the card
    image: {
      type: String,
      default: ''
    },
    // Visual variant of the card
    variant: {
      type: String,
      default: 'default',
      // Validator ensures only valid values are passed
      validator: (value) => ['default', 'elevated', 'outlined', 'filled'].includes(value)
    },
    // Badge text (e.g., "New", "Draft", "Published")
    badge: {
      type: String,
      default: ''
    },
    // Badge color variant
    badgeVariant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'warning', 'error'].includes(value)
    },
    // Whether the card is clickable
    clickable: {
      type: Boolean,
      default: false
    }
  },
  
  /**
   * Emits Definition
   * 
   * Emits declare the custom events this component can emit.
   * This is how child components communicate with parents.
   */
  emits: ['click'],
  
  /**
   * Methods
   * 
   * Methods are functions that can be called from the template
   * or from other methods.
   */
  methods: {
    // Handle card click - only emit if clickable
    handleClick(event) {
      if (this.clickable) {
        // $emit sends a custom event to the parent component
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="less" scoped>
/**
 * Card Styles using LESS
 * 
 * LESS is a CSS preprocessor that adds features like:
 * - Variables (we use global vars from vite.config.js)
 * - Nesting (cleaner, more readable styles)
 * - Mixins (reusable style blocks)
 * 
 * The 'scoped' attribute ensures these styles only apply to this component.
 */

.aem-card {
  // Base card styles
  background: @surface-color;
  border-radius: @border-radius;
  border: 1px solid @border-color;
  overflow: hidden;
  transition: all 0.3s ease;
  
  // Nested styles using LESS nesting
  &__header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: @text-primary;
    flex: 1;
  }
  
  &__subtitle {
    width: 100%;
    font-size: 0.875rem;
    color: @text-secondary;
    margin-top: 0.25rem;
  }
  
  &__badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    // Badge variants using LESS nesting
    &--primary {
      background: fade(@primary-color, 20%);
      color: @primary-color;
    }
    
    &--success {
      background: fade(@success-color, 20%);
      color: @success-color;
    }
    
    &--warning {
      background: fade(@warning-color, 20%);
      color: darken(@warning-color, 10%);
    }
    
    &--error {
      background: fade(@error-color, 20%);
      color: @error-color;
    }
  }
  
  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }
  
  &__body {
    padding: 1.5rem;
  }
  
  &__description {
    margin: 0;
    color: @text-secondary;
    line-height: 1.6;
  }
  
  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid @border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }
  
  // Card Variants
  &--elevated {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: none;
  }
  
  &--outlined {
    background: transparent;
    border: 2px solid @border-color;
  }
  
  &--filled {
    background: linear-gradient(135deg, @surface-color 0%, darken(@surface-color, 5%) 100%);
  }
  
  // Clickable state
  &--clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      border-color: @primary-color;
      
      .aem-card__image img {
        transform: scale(1.05);
      }
    }
    
    &:active {
      transform: translateY(-2px);
    }
  }
}
</style>
