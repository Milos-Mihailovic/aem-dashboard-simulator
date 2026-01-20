<!--
  Loading Spinner Component
  
  A reusable loading indicator for async operations.
  Simple but essential for good UX during data fetching.
-->

<template>
  <div class="loading-spinner" :class="`loading-spinner--${size}`">
    <div class="loading-spinner__circle"></div>
    <span v-if="text" class="loading-spinner__text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  
  props: {
    // Loading text to display
    text: {
      type: String,
      default: ''
    },
    // Size variant
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  }
}
</script>

<style lang="less" scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  
  &__circle {
    border-radius: 50%;
    border: 3px solid @border-color;
    border-top-color: @primary-color;
    animation: spin 1s linear infinite;
  }
  
  &__text {
    color: @text-secondary;
    font-size: 0.875rem;
  }
  
  // Size variants
  &--small {
    padding: 1rem;
    
    .loading-spinner__circle {
      width: 24px;
      height: 24px;
      border-width: 2px;
    }
    
    .loading-spinner__text {
      font-size: 0.75rem;
    }
  }
  
  &--medium {
    .loading-spinner__circle {
      width: 40px;
      height: 40px;
    }
  }
  
  &--large {
    padding: 3rem;
    
    .loading-spinner__circle {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }
    
    .loading-spinner__text {
      font-size: 1rem;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
