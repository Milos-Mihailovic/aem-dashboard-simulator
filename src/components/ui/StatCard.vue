<!--
  Stat Card Component
  
  A simple card for displaying statistics on the dashboard.
  Shows a metric value with a label and optional trend indicator.
-->

<template>
  <div class="stat-card" :class="`stat-card--${variant}`">
    <!-- Icon -->
    <div class="stat-card__icon">
      <span>{{ icon }}</span>
    </div>
    
    <!-- Content -->
    <div class="stat-card__content">
      <span class="stat-card__label">{{ label }}</span>
      <div class="stat-card__value-row">
        <span class="stat-card__value">{{ formattedValue }}</span>
        
        <!-- Trend Indicator -->
        <span 
          v-if="trend !== null" 
          class="stat-card__trend"
          :class="trendClass"
        >
          {{ trendIcon }} {{ Math.abs(trend) }}%
        </span>
      </div>
      
      <!-- Description -->
      <span v-if="description" class="stat-card__description">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  
  props: {
    // The statistic label
    label: {
      type: String,
      required: true
    },
    // The statistic value
    value: {
      type: [Number, String],
      required: true
    },
    // Icon emoji
    icon: {
      type: String,
      default: '📊'
    },
    // Trend percentage (positive = up, negative = down)
    trend: {
      type: Number,
      default: null
    },
    // Additional description
    description: {
      type: String,
      default: ''
    },
    // Color variant
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'error'].includes(value)
    },
    // Format type for the value
    format: {
      type: String,
      default: 'number',
      validator: (value) => ['number', 'currency', 'percent'].includes(value)
    }
  },
  
  computed: {
    /**
     * Format the value based on the format prop
     */
    formattedValue() {
      if (typeof this.value === 'string') return this.value
      
      switch (this.format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(this.value)
        case 'percent':
          return `${this.value}%`
        default:
          return new Intl.NumberFormat('en-US').format(this.value)
      }
    },
    
    /**
     * Determine trend direction class
     */
    trendClass() {
      if (this.trend > 0) return 'stat-card__trend--up'
      if (this.trend < 0) return 'stat-card__trend--down'
      return 'stat-card__trend--neutral'
    },
    
    /**
     * Get trend icon based on direction
     */
    trendIcon() {
      if (this.trend > 0) return '↑'
      if (this.trend < 0) return '↓'
      return '→'
    }
  }
}
</script>

<style lang="less" scoped>
.stat-card {
  background: @surface-color;
  border: 1px solid @border-color;
  border-radius: @border-radius;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  &__icon {
    width: 56px;
    height: 56px;
    border-radius: @border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    background: fade(@primary-color, 15%);
    flex-shrink: 0;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  
  &__label {
    font-size: 0.875rem;
    color: @text-secondary;
    margin-bottom: 0.25rem;
  }
  
  &__value-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  &__value {
    font-size: 1.75rem;
    font-weight: 700;
    color: @text-primary;
    line-height: 1.2;
  }
  
  &__trend {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    
    &--up {
      background: fade(@success-color, 15%);
      color: @success-color;
    }
    
    &--down {
      background: fade(@error-color, 15%);
      color: @error-color;
    }
    
    &--neutral {
      background: fade(@text-secondary, 15%);
      color: @text-secondary;
    }
  }
  
  &__description {
    font-size: 0.75rem;
    color: @text-secondary;
    margin-top: 0.5rem;
  }
  
  // Variants
  &--primary {
    border-left: 4px solid @primary-color;
    
    .stat-card__icon {
      background: fade(@primary-color, 15%);
    }
  }
  
  &--success {
    border-left: 4px solid @success-color;
    
    .stat-card__icon {
      background: fade(@success-color, 15%);
    }
  }
  
  &--warning {
    border-left: 4px solid @warning-color;
    
    .stat-card__icon {
      background: fade(@warning-color, 15%);
    }
  }
  
  &--error {
    border-left: 4px solid @error-color;
    
    .stat-card__icon {
      background: fade(@error-color, 15%);
    }
  }
}
</style>
