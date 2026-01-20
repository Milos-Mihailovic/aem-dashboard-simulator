/**
 * API Service Module
 * 
 * This module handles all communication with our REST API (json-server).
 * It provides a centralized place for all API calls, making it easier to:
 * - Manage API endpoints
 * - Handle errors consistently
 * - Add authentication headers if needed
 * 
 * BEGINNER TIP: Axios is a popular HTTP client library that makes it easy
 * to send HTTP requests and handle responses. It's similar to fetch() but
 * with more features and better browser support.
 */

import axios from 'axios'

/**
 * Create an Axios Instance
 * 
 * By creating an instance, we can set default configurations that apply
 * to all requests made with this instance.
 */
const apiClient = axios.create({
  // Base URL for all API requests
  // In development, Vite proxies /api to json-server on port 3001
  baseURL: '/api',
  
  // Default headers sent with every request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Request timeout in milliseconds (5 seconds)
  timeout: 5000
})

/**
 * Request Interceptor
 * 
 * Interceptors allow us to modify requests before they are sent.
 * This is useful for adding authentication tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log the request for debugging (helpful for beginners)
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * 
 * Interceptors can also process responses before they reach our code.
 * This is useful for error handling, data transformation, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`📥 API Response: ${response.status} from ${response.config.url}`)
    return response
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with an error status
      console.error(`❌ API Error ${error.response.status}:`, error.response.data)
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error: No response from server')
    } else {
      // Something else went wrong
      console.error('❌ Error:', error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * API Service Object
 * 
 * This object contains all our API methods organized by resource type.
 * Each method returns a Promise that resolves with the API response.
 */
const apiService = {
  /**
   * Components API
   * 
   * Methods for managing AEM-style components
   */
  components: {
    // GET all components
    getAll() {
      return apiClient.get('/components')
    },
    
    // GET a single component by ID
    getById(id) {
      return apiClient.get(`/components/${id}`)
    },
    
    // POST - Create a new component
    create(componentData) {
      return apiClient.post('/components', componentData)
    },
    
    // PUT - Update an existing component
    update(id, componentData) {
      return apiClient.put(`/components/${id}`, componentData)
    },
    
    // DELETE - Remove a component
    delete(id) {
      return apiClient.delete(`/components/${id}`)
    }
  },
  
  /**
   * Pages API
   * 
   * Methods for managing content pages
   */
  pages: {
    getAll() {
      return apiClient.get('/pages')
    },
    
    getById(id) {
      return apiClient.get(`/pages/${id}`)
    },
    
    create(pageData) {
      return apiClient.post('/pages', pageData)
    },
    
    update(id, pageData) {
      return apiClient.put(`/pages/${id}`, pageData)
    },
    
    delete(id) {
      return apiClient.delete(`/pages/${id}`)
    }
  },
  
  /**
   * Statistics API
   * 
   * Methods for fetching dashboard statistics
   */
  statistics: {
    get() {
      return apiClient.get('/statistics')
    }
  },
  
  /**
   * Templates API
   * 
   * Methods for fetching available page templates
   */
  templates: {
    getAll() {
      return apiClient.get('/templates')
    }
  }
}

// Export the API service for use in components
export default apiService

// Also export the raw axios client if needed for custom requests
export { apiClient }
