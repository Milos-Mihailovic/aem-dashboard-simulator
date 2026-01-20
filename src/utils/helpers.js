/**
 * Helper Utilities Module
 * 
 * This module contains reusable JavaScript utility functions that can be
 * used throughout the application. These are pure functions that don't
 * depend on Vue or any specific component.
 * 
 * BEGINNER TIP: Utility functions help keep your code DRY (Don't Repeat Yourself)
 * by centralizing common operations in one place.
 */

// Import jQuery for DOM manipulation utilities
// Note: In Vue.js, we typically use Vue's reactivity system instead of jQuery,
// but jQuery can still be useful for specific DOM operations and animations
import $ from 'jquery'

/**
 * Date Formatting Utilities
 * 
 * Functions for formatting dates in a human-readable way
 */

/**
 * Format a date string to a localized format
 * @param {string|Date} dateString - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'en-US') {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Relative time string
 */
export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}

/**
 * String Utilities
 */

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a string to slug format (URL-friendly)
 * @param {string} str - The string to convert
 * @returns {string} Slugified string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
}

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, length = 100, suffix = '...') {
  if (!str || str.length <= length) return str
  return str.substring(0, length - suffix.length) + suffix
}

/**
 * Array Utilities
 */

/**
 * Sort an array of objects by a specific key
 * @param {Array} array - The array to sort
 * @param {string} key - The key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortByKey(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const valueA = a[key]
    const valueB = b[key]
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1
    if (valueA > valueB) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filter an array of objects by a search term
 * @param {Array} array - The array to filter
 * @param {string} searchTerm - The search term
 * @param {Array} keys - The keys to search in
 * @returns {Array} Filtered array
 */
export function filterBySearch(array, searchTerm, keys) {
  if (!searchTerm) return array
  
  const term = searchTerm.toLowerCase()
  return array.filter(item => 
    keys.some(key => {
      const value = item[key]
      return value && value.toString().toLowerCase().includes(term)
    })
  )
}

/**
 * Performance Utilities
 */

/**
 * Debounce function - delays execution until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * BEGINNER TIP: Use debounce for search inputs, window resize handlers,
 * or any event that fires rapidly but you only want to act on the final value.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function - ensures a function is called at most once
 * in a specified time period.
 * 
 * BEGINNER TIP: Use throttle for scroll handlers, mousemove events,
 * or any event where you want regular updates but not on every single event.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * jQuery Utilities
 * 
 * These functions demonstrate jQuery usage within a Vue.js application.
 * While Vue handles most DOM operations, jQuery can be useful for:
 * - Complex animations
 * - Legacy code integration
 * - Specific DOM manipulations
 */

/**
 * Animate an element with a fade effect using jQuery
 * @param {string} selector - CSS selector for the element
 * @param {string} effect - 'in' or 'out'
 * @param {number} duration - Animation duration in milliseconds
 */
export function jQueryFade(selector, effect = 'in', duration = 400) {
  const $element = $(selector)
  if (effect === 'in') {
    $element.fadeIn(duration)
  } else {
    $element.fadeOut(duration)
  }
}

/**
 * Animate an element with a slide effect using jQuery
 * @param {string} selector - CSS selector for the element
 * @param {string} effect - 'down', 'up', or 'toggle'
 * @param {number} duration - Animation duration in milliseconds
 */
export function jQuerySlide(selector, effect = 'toggle', duration = 400) {
  const $element = $(selector)
  switch (effect) {
    case 'down':
      $element.slideDown(duration)
      break
    case 'up':
      $element.slideUp(duration)
      break
    default:
      $element.slideToggle(duration)
  }
}

/**
 * Add a CSS class with animation using jQuery
 * @param {string} selector - CSS selector for the element
 * @param {string} className - The class to add
 */
export function jQueryAddClass(selector, className) {
  $(selector).addClass(className)
}

/**
 * Smooth scroll to an element using jQuery
 * @param {string} selector - CSS selector for the target element
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} offset - Offset from the top in pixels
 */
export function jQueryScrollTo(selector, duration = 500, offset = 0) {
  const $target = $(selector)
  if ($target.length) {
    $('html, body').animate({
      scrollTop: $target.offset().top - offset
    }, duration)
  }
}

/**
 * Validation Utilities
 */

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate that a string is not empty
 * @param {string} str - The string to validate
 * @returns {boolean} True if not empty
 */
export function isNotEmpty(str) {
  return str && str.trim().length > 0
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
