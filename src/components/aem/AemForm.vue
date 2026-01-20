<!--
  AEM Form Component
  
  A reusable form component that mimics AEM's form functionality.
  This component demonstrates:
  - v-model for two-way data binding
  - Form validation
  - Event handling
  - Dynamic form fields
  
  BEGINNER TIP: Forms are essential for user input. Vue's v-model
  makes it easy to sync form inputs with component data.
-->

<template>
  <form 
    class="aem-form"
    :class="{ 'aem-form--loading': loading }"
    @submit.prevent="handleSubmit"
  >
    <!-- Form Header -->
    <div v-if="title || $slots.header" class="aem-form__header">
      <slot name="header">
        <h3 class="aem-form__title">{{ title }}</h3>
        <p v-if="description" class="aem-form__description">{{ description }}</p>
      </slot>
    </div>
    
    <!-- Form Fields -->
    <div class="aem-form__fields">
      <!-- 
        Dynamic Field Rendering
        
        We loop through the fields prop to render form inputs dynamically.
        This makes the form highly reusable with different field configurations.
      -->
      <div 
        v-for="field in fields" 
        :key="field.name"
        class="aem-form__field"
        :class="{ 
          'aem-form__field--error': errors[field.name],
          'aem-form__field--full': field.fullWidth
        }"
      >
        <!-- Field Label -->
        <label :for="field.name" class="aem-form__label">
          {{ field.label }}
          <span v-if="field.required" class="aem-form__required">*</span>
        </label>
        
        <!-- Text Input -->
        <input
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
          :id="field.name"
          :type="field.type"
          :name="field.name"
          :placeholder="field.placeholder"
          :disabled="loading"
          v-model="formData[field.name]"
          class="aem-form__input"
          @blur="validateField(field)"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          :name="field.name"
          :placeholder="field.placeholder"
          :rows="field.rows || 4"
          :disabled="loading"
          v-model="formData[field.name]"
          class="aem-form__textarea"
          @blur="validateField(field)"
        ></textarea>
        
        <!-- Select Dropdown -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          :name="field.name"
          :disabled="loading"
          v-model="formData[field.name]"
          class="aem-form__select"
          @change="validateField(field)"
        >
          <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
          <option 
            v-for="option in field.options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Checkbox -->
        <label 
          v-else-if="field.type === 'checkbox'"
          class="aem-form__checkbox-label"
        >
          <input
            type="checkbox"
            :id="field.name"
            :name="field.name"
            :disabled="loading"
            v-model="formData[field.name]"
            class="aem-form__checkbox"
            @change="validateField(field)"
          />
          <span class="aem-form__checkbox-text">{{ field.checkboxLabel || field.label }}</span>
        </label>
        
        <!-- Error Message -->
        <span v-if="errors[field.name]" class="aem-form__error">
          {{ errors[field.name] }}
        </span>
        
        <!-- Help Text -->
        <span v-else-if="field.help" class="aem-form__help">
          {{ field.help }}
        </span>
      </div>
      
      <!-- Custom Fields Slot -->
      <slot name="fields"></slot>
    </div>
    
    <!-- Form Actions -->
    <div class="aem-form__actions">
      <slot name="actions">
        <!-- Cancel Button -->
        <button 
          v-if="showCancel"
          type="button" 
          class="aem-form__button aem-form__button--secondary"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        
        <!-- Submit Button -->
        <button 
          type="submit" 
          class="aem-form__button aem-form__button--primary"
          :disabled="loading || !isValid"
        >
          <span v-if="loading" class="aem-form__spinner"></span>
          {{ loading ? loadingText : submitText }}
        </button>
      </slot>
    </div>
    
    <!-- Form Messages -->
    <div v-if="successMessage || errorMessage" class="aem-form__messages">
      <div v-if="successMessage" class="aem-form__message aem-form__message--success">
        ✓ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="aem-form__message aem-form__message--error">
        ✕ {{ errorMessage }}
      </div>
    </div>
  </form>
</template>

<script>
import { isValidEmail, isNotEmpty } from '@/utils/helpers'

export default {
  name: 'AemForm',
  
  props: {
    // Form title
    title: {
      type: String,
      default: ''
    },
    // Form description
    description: {
      type: String,
      default: ''
    },
    // Array of field configurations
    fields: {
      type: Array,
      default: () => [],
      /**
       * Field object structure:
       * {
       *   name: 'fieldName',        // Required: unique identifier
       *   label: 'Field Label',     // Required: display label
       *   type: 'text',             // Required: input type
       *   placeholder: 'Enter...',  // Optional: placeholder text
       *   required: true,           // Optional: is field required
       *   validation: 'email',      // Optional: validation type
       *   help: 'Help text',        // Optional: help text
       *   options: [],              // Required for select: dropdown options
       *   fullWidth: false          // Optional: span full width
       * }
       */
    },
    // Initial form values
    initialValues: {
      type: Object,
      default: () => ({})
    },
    // Button text customization
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loadingText: {
      type: String,
      default: 'Submitting...'
    },
    // Show cancel button
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['submit', 'cancel', 'change'],
  
  data() {
    return {
      // Form data object - holds all field values
      formData: {},
      // Validation errors object
      errors: {},
      // Loading state
      loading: false,
      // Success/error messages
      successMessage: '',
      errorMessage: ''
    }
  },
  
  computed: {
    /**
     * Check if form is valid
     * Returns true if there are no errors and all required fields have values
     */
    isValid() {
      // Check for any errors
      if (Object.values(this.errors).some(error => error)) {
        return false
      }
      
      // Check required fields have values
      return this.fields
        .filter(field => field.required)
        .every(field => {
          const value = this.formData[field.name]
          return value !== undefined && value !== '' && value !== null
        })
    }
  },
  
  /**
   * Watch
   * 
   * Watchers allow you to perform actions when data changes.
   * Here we watch formData to emit changes to the parent.
   */
  watch: {
    formData: {
      handler(newValue) {
        this.$emit('change', { ...newValue })
      },
      deep: true // Watch nested properties
    }
  },
  
  /**
   * Created Lifecycle Hook
   * 
   * Called after the instance is created.
   * We use it to initialize form data from props.
   */
  created() {
    this.initializeFormData()
  },
  
  methods: {
    /**
     * Initialize form data from fields and initial values
     */
    initializeFormData() {
      const data = {}
      
      this.fields.forEach(field => {
        // Use initial value if provided, otherwise use field default or empty string
        data[field.name] = this.initialValues[field.name] ?? field.default ?? ''
      })
      
      this.formData = data
    },
    
    /**
     * Validate a single field
     * @param {Object} field - The field configuration object
     */
    validateField(field) {
      const value = this.formData[field.name]
      let error = ''
      
      // Required validation
      if (field.required && !isNotEmpty(value?.toString())) {
        error = `${field.label} is required`
      }
      // Email validation
      else if (field.validation === 'email' && value && !isValidEmail(value)) {
        error = 'Please enter a valid email address'
      }
      // Min length validation
      else if (field.minLength && value && value.length < field.minLength) {
        error = `${field.label} must be at least ${field.minLength} characters`
      }
      // Max length validation
      else if (field.maxLength && value && value.length > field.maxLength) {
        error = `${field.label} must be no more than ${field.maxLength} characters`
      }
      // Custom validation function
      else if (field.validate && typeof field.validate === 'function') {
        error = field.validate(value) || ''
      }
      
      // Update errors object reactively
      this.errors = { ...this.errors, [field.name]: error }
      
      return !error
    },
    
    /**
     * Validate all fields
     * @returns {boolean} True if all fields are valid
     */
    validateAll() {
      let isValid = true
      
      this.fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false
        }
      })
      
      return isValid
    },
    
    /**
     * Handle form submission
     */
    async handleSubmit() {
      // Clear previous messages
      this.successMessage = ''
      this.errorMessage = ''
      
      // Validate all fields
      if (!this.validateAll()) {
        this.errorMessage = 'Please fix the errors above'
        return
      }
      
      // Set loading state
      this.loading = true
      
      try {
        // Emit submit event with form data
        // Parent component handles the actual submission
        await this.$emit('submit', { ...this.formData })
        
        // Show success message
        this.successMessage = 'Form submitted successfully!'
        
        // Reset form after successful submission (optional)
        // this.resetForm()
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred'
      } finally {
        this.loading = false
      }
    },
    
    /**
     * Handle cancel button click
     */
    handleCancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    
    /**
     * Reset form to initial state
     */
    resetForm() {
      this.initializeFormData()
      this.errors = {}
      this.successMessage = ''
      this.errorMessage = ''
    },
    
    /**
     * Set loading state (can be called from parent)
     */
    setLoading(state) {
      this.loading = state
    },
    
    /**
     * Set success message (can be called from parent)
     */
    setSuccess(message) {
      this.successMessage = message
      this.errorMessage = ''
    },
    
    /**
     * Set error message (can be called from parent)
     */
    setError(message) {
      this.errorMessage = message
      this.successMessage = ''
    }
  }
}
</script>

<style lang="less" scoped>
.aem-form {
  background: @surface-color;
  border-radius: @border-radius;
  border: 1px solid @border-color;
  padding: 2rem;
  
  &--loading {
    opacity: 0.7;
    pointer-events: none;
  }
  
  &__header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid @border-color;
  }
  
  &__title {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: @text-primary;
  }
  
  &__description {
    margin: 0;
    color: @text-secondary;
    line-height: 1.6;
  }
  
  &__fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    &--full {
      grid-column: 1 / -1;
    }
    
    &--error {
      .aem-form__input,
      .aem-form__textarea,
      .aem-form__select {
        border-color: @error-color;
        
        &:focus {
          box-shadow: 0 0 0 3px fade(@error-color, 20%);
        }
      }
    }
  }
  
  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: @text-primary;
  }
  
  &__required {
    color: @error-color;
    margin-left: 0.25rem;
  }
  
  &__input,
  &__textarea,
  &__select {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: @text-primary;
    background: @background-color;
    border: 1px solid @border-color;
    border-radius: @border-radius;
    transition: all 0.2s ease;
    
    &::placeholder {
      color: @text-secondary;
    }
    
    &:focus {
      outline: none;
      border-color: @primary-color;
      box-shadow: 0 0 0 3px fade(@primary-color, 20%);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &__textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  &__select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
  }
  
  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }
  
  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: @primary-color;
    cursor: pointer;
  }
  
  &__checkbox-text {
    font-size: 0.875rem;
    color: @text-secondary;
  }
  
  &__error {
    font-size: 0.75rem;
    color: @error-color;
  }
  
  &__help {
    font-size: 0.75rem;
    color: @text-secondary;
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid @border-color;
  }
  
  &__button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: @border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &--primary {
      background: @primary-color;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background: darken(@primary-color, 10%);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
    }
  }
  
  &__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  &__messages {
    margin-top: 1.5rem;
  }
  
  &__message {
    padding: 1rem;
    border-radius: @border-radius;
    font-size: 0.875rem;
    
    &--success {
      background: fade(@success-color, 15%);
      color: @success-color;
      border: 1px solid fade(@success-color, 30%);
    }
    
    &--error {
      background: fade(@error-color, 15%);
      color: @error-color;
      border: 1px solid fade(@error-color, 30%);
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
