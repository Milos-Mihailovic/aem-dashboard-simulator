# 🎨 AEM Dashboard Simulator

A beginner-friendly Vue.js project that simulates Adobe Experience Manager (AEM) dashboard functionality. This project demonstrates essential frontend development skills including Vue.js components, routing, REST API integration, and modern CSS with LESS.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)
![LESS](https://img.shields.io/badge/LESS-4.x-1D365D?style=flat-square&logo=less)

## 📚 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [Understanding the Code](#-understanding-the-code)
- [API Reference](#-api-reference)
- [Learning Resources](#-learning-resources)

## ✨ Features

- **📊 Dashboard** - View statistics and overview of your content management system
- **🧩 AEM Components** - Create, edit, and manage reusable UI components
- **📄 Content Pages** - Build pages using templates and components
- **🔄 REST API Integration** - Fetch and post data using Axios
- **🎨 LESS Styling** - Modern CSS with variables, nesting, and mixins
- **🧭 Vue Router** - Client-side routing with navigation guards
- **✨ jQuery Integration** - Demonstrates jQuery usage alongside Vue.js

## 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| **Vue.js 3** | Frontend framework with Composition API |
| **Vue Router** | Client-side routing and navigation |
| **Axios** | HTTP client for API requests |
| **LESS** | CSS preprocessor for styling |
| **jQuery** | DOM manipulation and animations |
| **Vite** | Build tool and development server |
| **json-server** | Mock REST API for development |

## 📁 Project Structure

```
AEMProj/
├── src/
│   ├── components/           # Reusable Vue components
│   │   ├── aem/              # AEM-style components
│   │   │   ├── AemBanner.vue # Hero banner component
│   │   │   ├── AemBlock.vue  # Content block component
│   │   │   ├── AemCard.vue   # Card component
│   │   │   └── AemForm.vue   # Form component
│   │   └── ui/               # UI components
│   │       ├── AppNavigation.vue
│   │       ├── LoadingSpinner.vue
│   │       └── StatCard.vue
│   ├── views/                # Page components
│   │   ├── Dashboard.vue     # Home/Dashboard page
│   │   ├── Components.vue    # Components management
│   │   ├── ComponentDetail.vue
│   │   └── Pages.vue         # Pages management
│   ├── router/               # Vue Router configuration
│   │   └── index.js
│   ├── services/             # API services
│   │   └── api.js            # Axios configuration
│   ├── utils/                # Utility functions
│   │   └── helpers.js        # Helper utilities
│   ├── styles/               # Global styles
│   │   └── main.less
│   ├── App.vue               # Root component
│   └── main.js               # Application entry point
├── db.json                   # Mock API data
├── vite.config.js            # Vite configuration
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd AEMProj
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install concurrently for running multiple scripts:**
   ```bash
   npm install concurrently --save-dev
   ```

## 🏃 Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm start
```

This starts both the Vue.js dev server and the json-server API simultaneously.

### Option 2: Run Servers Separately

**Terminal 1 - Start the Mock API:**
```bash
npm run api
```
This starts json-server on `http://localhost:3001`

**Terminal 2 - Start the Vue.js Development Server:**
```bash
npm run dev
```
This starts Vite on `http://localhost:5173`

### Access the Application

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

## 📖 Understanding the Code

### Vue.js Concepts Demonstrated

#### 1. **Components** (`src/components/`)
Components are reusable pieces of UI. Each `.vue` file contains:
- `<template>` - HTML structure
- `<script>` - JavaScript logic
- `<style>` - CSS styles (scoped to component)

```vue
<!-- Example: AemCard.vue -->
<template>
  <div class="aem-card">
    <slot></slot> <!-- Content injection point -->
  </div>
</template>

<script>
export default {
  name: 'AemCard',
  props: {
    title: String,
    description: String
  }
}
</script>
```

#### 2. **Props** - Passing Data to Components
```vue
<!-- Parent component -->
<AemCard 
  title="My Card" 
  description="Card content"
  :clickable="true"
/>
```

#### 3. **Events** - Child to Parent Communication
```vue
<!-- Child emits event -->
this.$emit('click', data)

<!-- Parent listens -->
<AemCard @click="handleClick" />
```

#### 4. **Slots** - Content Injection
```vue
<!-- Component with slots -->
<AemCard>
  <template #header>Custom Header</template>
  <p>Default slot content</p>
  <template #footer>Custom Footer</template>
</AemCard>
```

#### 5. **Vue Router** - Navigation
```javascript
// Programmatic navigation
this.$router.push('/components')
this.$router.push({ name: 'ComponentDetail', params: { id: 1 } })

// Template navigation
<router-link to="/dashboard">Dashboard</router-link>
```

#### 6. **Computed Properties** - Derived State
```javascript
computed: {
  filteredItems() {
    return this.items.filter(item => item.active)
  }
}
```

#### 7. **API Integration** - Axios
```javascript
// Fetch data
const response = await apiService.components.getAll()

// Create data
await apiService.components.create({ name: 'New Component' })
```

### LESS Features Used

```less
// Variables (defined in vite.config.js)
@primary-color: #1a73e8;

// Nesting
.card {
  &__header {
    // Compiles to .card__header
  }
  
  &:hover {
    // Compiles to .card:hover
  }
}

// Functions
background: fade(@primary-color, 20%); // 20% opacity
color: darken(@primary-color, 10%);    // 10% darker
```

### jQuery Integration

While Vue.js handles most DOM operations, jQuery is included for:
- Complex animations
- Legacy code integration
- Specific DOM manipulations

```javascript
import { jQuerySlide, jQueryFade } from '@/utils/helpers'

// Slide animation
jQuerySlide('#element', 'down', 500)

// Fade animation
jQueryFade('#element', 'in', 400)
```

## 📡 API Reference

The mock API (json-server) provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/components` | Get all components |
| GET | `/components/:id` | Get single component |
| POST | `/components` | Create component |
| PUT | `/components/:id` | Update component |
| DELETE | `/components/:id` | Delete component |
| GET | `/pages` | Get all pages |
| GET | `/pages/:id` | Get single page |
| POST | `/pages` | Create page |
| PUT | `/pages/:id` | Update page |
| DELETE | `/pages/:id` | Delete page |
| GET | `/statistics` | Get dashboard stats |
| GET | `/templates` | Get page templates |

### Example API Call

```javascript
import apiService from '@/services/api'

// Fetch all components
const response = await apiService.components.getAll()
console.log(response.data)

// Create a new component
await apiService.components.create({
  name: 'New Banner',
  type: 'banner',
  description: 'A new banner component',
  author: 'Admin',
  status: 'draft'
})
```

## 📚 Learning Resources

### Vue.js
- [Vue.js Official Documentation](https://vuejs.org/guide/introduction.html)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)

### LESS CSS
- [LESS Documentation](https://lesscss.org/)
- [LESS Features](https://lesscss.org/features/)

### JavaScript
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://es6-features.org/)

### Git
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## 🧪 Testing (Bonus)

To add testing to this project, consider using Vitest:

```bash
npm install -D vitest @vue/test-utils happy-dom
```

Example test:
```javascript
import { mount } from '@vue/test-utils'
import AemCard from '@/components/aem/AemCard.vue'

describe('AemCard', () => {
  it('renders title prop', () => {
    const wrapper = mount(AemCard, {
      props: { title: 'Test Title' }
    })
    expect(wrapper.text()).toContain('Test Title')
  })
})
```

## 📝 Skills Practiced

By completing this project, you've practiced:

- ✅ **Vue.js** - Components, props, events, slots, computed properties
- ✅ **Vue Router** - Navigation, route parameters, navigation guards
- ✅ **HTML/CSS** - Semantic markup, responsive design
- ✅ **LESS** - Variables, nesting, functions, mixins
- ✅ **JavaScript** - ES6+, async/await, array methods
- ✅ **REST APIs** - CRUD operations, Axios, error handling
- ✅ **jQuery** - DOM manipulation, animations
- ✅ **Git** - Version control basics

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add user authentication
- Implement drag-and-drop for components
- Add more component types
- Create a theme switcher
- Add unit tests with Vitest

## 📄 License

MIT License - feel free to use this project for learning and development!

---

**Happy Coding! 🚀**

*Built with ❤️ as a learning project for Vue.js beginners*
