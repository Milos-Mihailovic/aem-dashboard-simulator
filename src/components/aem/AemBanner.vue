<!--
  AEM Banner Component
  
  A hero banner component similar to Adobe Experience Manager's (AEM) Teaser
  and Hero components from AEM Core Components. In AEM, these are used for:
  - Landing page heroes
  - Campaign banners
  - Call-to-action sections
  - Marketing promotions
  
  Reference: https://experienceleague.adobe.com/docs/experience-manager-core-components/using/components/teaser.html
  
  Demonstrates:
  - Background image handling (like AEM's DAM asset integration)
  - Overlay effects
  - Responsive design
  - CSS animations
-->

<template>
  <div 
    class="aem-banner"
    :class="[
      `aem-banner--${size}`,
      `aem-banner--${alignment}`,
      { 'aem-banner--overlay': overlay }
    ]"
    :style="bannerStyles"
  >
    <!-- Overlay Layer -->
    <div v-if="overlay" class="aem-banner__overlay" :style="overlayStyles"></div>
    
    <!-- Content Container -->
    <div class="aem-banner__content">
      <!-- Eyebrow Text (small text above title) -->
      <span v-if="eyebrow" class="aem-banner__eyebrow">{{ eyebrow }}</span>
      
      <!-- Main Title -->
      <h1 v-if="title" class="aem-banner__title">{{ title }}</h1>
      
      <!-- Subtitle -->
      <p v-if="subtitle" class="aem-banner__subtitle">{{ subtitle }}</p>
      
      <!-- Description -->
      <p v-if="description" class="aem-banner__description">{{ description }}</p>
      
      <!-- Custom Content Slot -->
      <slot></slot>
      
      <!-- Call to Action Buttons -->
      <div v-if="$slots.actions || primaryAction" class="aem-banner__actions">
        <slot name="actions">
          <!-- Primary CTA Button -->
          <button 
            v-if="primaryAction"
            class="aem-banner__button aem-banner__button--primary"
            @click="$emit('primary-click')"
          >
            {{ primaryAction }}
          </button>
          
          <!-- Secondary CTA Button -->
          <button 
            v-if="secondaryAction"
            class="aem-banner__button aem-banner__button--secondary"
            @click="$emit('secondary-click')"
          >
            {{ secondaryAction }}
          </button>
        </slot>
      </div>
    </div>
    
    <!-- Decorative Elements -->
    <div v-if="showDecorations" class="aem-banner__decorations">
      <div class="aem-banner__decoration aem-banner__decoration--1"></div>
      <div class="aem-banner__decoration aem-banner__decoration--2"></div>
      <div class="aem-banner__decoration aem-banner__decoration--3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AemBanner',
  
  props: {
    // Text content
    eyebrow: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    
    // Background
    backgroundImage: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    
    // Overlay
    overlay: {
      type: Boolean,
      default: true
    },
    overlayColor: {
      type: String,
      default: 'rgba(13, 17, 23, 0.8)'
    },
    
    // Layout
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
    },
    alignment: {
      type: String,
      default: 'center',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    
    // Actions
    primaryAction: {
      type: String,
      default: ''
    },
    secondaryAction: {
      type: String,
      default: ''
    },
    
    // Decorations
    showDecorations: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['primary-click', 'secondary-click'],
  
  computed: {
    bannerStyles() {
      const styles = {}
      
      if (this.backgroundImage) {
        styles.backgroundImage = `url(${this.backgroundImage})`
      }
      
      if (this.backgroundColor) {
        styles.backgroundColor = this.backgroundColor
      }
      
      return styles
    },
    
    overlayStyles() {
      return {
        background: this.overlayColor
      }
    }
  }
}
</script>

<style lang="less" scoped>
.aem-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: @surface-color;
  overflow: hidden;
  border-radius: @border-radius;
  
  // Size variants
  &--small {
    min-height: 200px;
    padding: 2rem;
  }
  
  &--medium {
    min-height: 350px;
    padding: 3rem;
  }
  
  &--large {
    min-height: 500px;
    padding: 4rem;
  }
  
  &--full {
    min-height: 100vh;
    padding: 4rem;
    border-radius: 0;
  }
  
  // Alignment variants
  &--left {
    justify-content: flex-start;
    
    .aem-banner__content {
      text-align: left;
      align-items: flex-start;
    }
  }
  
  &--center {
    justify-content: center;
    
    .aem-banner__content {
      text-align: center;
      align-items: center;
    }
  }
  
  &--right {
    justify-content: flex-end;
    
    .aem-banner__content {
      text-align: right;
      align-items: flex-end;
    }
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  
  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    animation: fadeInUp 0.8s ease-out;
  }
  
  &__eyebrow {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: @primary-color;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease-out 0.1s both;
  }
  
  &__title {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: @text-primary;
    line-height: 1.2;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  &__subtitle {
    margin: 0 0 1rem;
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 500;
    color: @text-primary;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  
  &__description {
    margin: 0 0 2rem;
    font-size: 1.125rem;
    color: @text-secondary;
    line-height: 1.7;
    max-width: 600px;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  
  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }
  
  &__button {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &--primary {
      background: @primary-color;
      color: white;
      border: 2px solid @primary-color;
      
      &:hover {
        background: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px fade(@primary-color, 40%);
      }
    }
    
    &--secondary {
      background: transparent;
      color: @text-primary;
      border: 2px solid @border-color;
      
      &:hover {
        background: @surface-color;
        border-color: @text-primary;
        transform: translateY(-2px);
      }
    }
  }
  
  // Decorative elements
  &__decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
  }
  
  &__decoration {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    
    &--1 {
      width: 400px;
      height: 400px;
      background: @primary-color;
      top: -200px;
      right: -100px;
      animation: float 20s ease-in-out infinite;
    }
    
    &--2 {
      width: 300px;
      height: 300px;
      background: @success-color;
      bottom: -150px;
      left: -100px;
      animation: float 25s ease-in-out infinite reverse;
    }
    
    &--3 {
      width: 200px;
      height: 200px;
      background: @warning-color;
      top: 50%;
      right: 10%;
      animation: float 15s ease-in-out infinite;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(20px, -20px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  75% {
    transform: translate(15px, 15px);
  }
}
</style>
