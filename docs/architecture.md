# Architecture Documentation

## Overview

This is a multi-step wizard application built with React that generates YAML configuration files for Camunda 8 products. The wizard guides users through product selection, database configuration, and environment variable setup, then generates a complete YAML configuration based on their choices.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Data Flow](#data-flow)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Conditional Rendering Logic](#conditional-rendering-logic)
6. [YAML Generation](#yaml-generation)
7. [Adding New Features](#adding-new-features)

---

## Core Concepts

### The Two Main Data Structures

**1. `wizardSteps` (Static Blueprint)**
- An array of step objects that defines the entire wizard structure
- Never changes during runtime
- Think of it as the instruction manual

**2. `answers` (Dynamic State)**
- An object that stores user's responses
- Updates as user interacts with the wizard
- Think of it as the filled-in form

### Controlled Components

All inputs in this application are "controlled components," meaning:
- React state (`answers`) is the single source of truth
- Input values come from state
- Changes update state, which triggers re-render
- This gives us complete control over form behavior

---

## Data Flow

### High-Level Flow
```
User Interaction
    ↓
Event Handler (onChange, onClick)
    ↓
saveAnswer(questionId, value)
    ↓
setAnswers({...answers, [questionId]: value})
    ↓
React Re-renders
    ↓
Computed Values Recalculated (visibleSteps, currentStepData)
    ↓
UI Updates (new questions appear, inputs show values)
    ↓
Wait for next interaction
```

### Detailed Example

**Scenario: User selects "Orchestration Cluster" product**

1. **User Action**: Clicks checkbox for "Orchestration Cluster"

2. **Event Fires**: Checkbox `onChange` handler runs

3. **State Update**: 
```js
   saveAnswer('products', ['Orchestration Cluster'])
   // Results in: answers = { products: ['Orchestration Cluster'] }
```

4. **React Re-renders**: Entire `App` component function runs again

5. **Filtering**:
```js
   visibleSteps = wizardSteps.filter(step => {
     // Orchestration Cluster database step's showIf returns true
     // Web Modeler step's showIf returns false
   })
   // Result: Only relevant steps included
```

6. **UI Updates**: 
   - Checkbox shows as checked
   - Step counter updates to show new total
   - Next page will show Orchestration Cluster database config

---

## Component Architecture

### Component Hierarchy
```
App (Main Component)
├── Breadcrumb (Step indicator)
├── Wizard Content Section
│   └── QuestionRenderer (for each question)
│       ├── Radio buttons
│       ├── Checkboxes
│       ├── Text inputs
│       └── EnvironmentVariablesManager
│           └── Add/Edit/Delete form
├── Output Panel (YAML preview)
├── Navigation (Back/Next buttons)
└── Generate Button
```

### Component Responsibilities

**App Component**
- Holds all state (`page`, `answers`, `yamlOutput`)
- Defines wizard configuration (`wizardSteps`)
- Calculates which steps to show (`visibleSteps`)
- Handles navigation (next/previous)
- Generates YAML configuration
- Orchestrates the entire wizard flow

**QuestionRenderer Component**
- "Dumb" presentational component
- Receives: question config, current value, onChange callback
- Decides which input type to render based on `question.type`
- Reports changes back to parent via `onChange`
- Has no internal state

**EnvironmentVariablesManager Component**
- Self-contained component for managing env var lists
- Has own internal state for the list and form fields
- Syncs changes back to parent via `onChange`
- Handles add, edit, delete operations

---

## State Management

### State Variables
```js
const [page, setPage] = useState(1)
const [answers, setAnswers] = useState({})
const [yamlOutput, setYamlOutput] = useState('')
```

**`page`**
- Type: Number (1-based)
- Purpose: Tracks which step user is currently on
- Updates: Via `next()` and `previous()` functions

**`answers`**
- Type: Object with question IDs as keys
- Purpose: Stores all user responses
- Updates: Via `saveAnswer(questionId, value)`
- Structure example:
```js
  {
    products: ['Orchestration Cluster', 'Optimize'],
    shared_database: 'Elasticsearch',
    shared_es_username: 'elastic',
    shared_es_password: 'secure123',
    orchestration_cluster_env_vars: [
      { name: 'LOG_LEVEL', value: 'DEBUG' }
    ]
  }
```

**`yamlOutput`**
- Type: String
- Purpose: Stores generated YAML configuration
- Updates: When user clicks "Generate" button

### Computed Values (Not State)

These recalculate on every render:
```js
const visibleSteps = wizardSteps.filter(step => ...)
const totalPages = visibleSteps.length
const currentStepData = visibleSteps[page - 1]
```

**Why not state?**
- They're derived from existing state (`answers`, `page`)
- Storing them in state would cause sync issues
- React efficiently recalculates them each render

---

## Conditional Rendering Logic

### Two Levels of Conditions

**1. Step-Level (showIf on step)**

Controls whether an entire step appears in the wizard.
```js
{
  stepNumber: 2,
  title: "Orchestration Cluster Database Configuration",
  showIf: (answers) => answers.products?.includes('Orchestration Cluster'),
  questions: [...]
}
```

How it works:
- `visibleSteps` filters out steps where `showIf(answers)` returns false
- If user didn't select that product, step never appears
- Step numbers in UI adjust automatically

**2. Question-Level (showIf on question)**

Controls whether individual questions appear within a step.
```js
{
  id: 'orchestration_cluster_es_username',
  label: 'Elasticsearch Username',
  showIf: (answers) => answers.orchestration_cluster_database === 'Elasticsearch'
}
```

How it works:
- Checked during render in `currentStepData.questions.map()`
- If `showIf` returns false, question returns `null` (doesn't render)
- Other questions on same step remain visible

### Conditional Logic Patterns Used

**Pattern 1: Product Selection**
```js
showIf: (answers) => answers.products?.includes('Product Name')
```
Shows step only if product was selected.

**Pattern 2: Database Type**
```js
showIf: (answers) => answers.some_database === 'Elasticsearch'
```
Shows fields only for selected database type.

**Pattern 3: Combination Logic**
```js
showIf: (answers) => 
  answers.products?.includes('A') && 
  answers.products?.includes('B')
```
Shows step only when multiple conditions met.

**Pattern 4: Exclusive Logic**
```js
showIf: (answers) => 
  answers.products?.includes('A') && 
  !answers.products?.includes('B')
```
Shows step only when A selected but NOT B.

---

## YAML Generation

### Generation Strategy

The `generateYaml()` function builds YAML as a string by:
1. Starting with empty string
2. Checking conditions for each possible section
3. Appending YAML blocks using template literals
4. Setting final output to state

### Key Generation Logic

**Shared vs Separate Database Handling**

When both Orchestration Cluster and Optimize are selected, they share one database configuration:
```js
const bothSelected = 
  answers.products?.includes('Orchestration Cluster') && 
  answers.products?.includes('Optimize')

// Use shared_ answers if both selected, otherwise use product-specific answers
const ocDatabase = bothSelected 
  ? answers.shared_database 
  : answers.orchestration_cluster_database
```

**Global vs Product-Specific Sections**

- `global.elasticsearch` / `global.opensearch`: Driven by Orchestration Cluster
- `optimize.elasticsearch` / `optimize.opensearch`: Only when Optimize standalone
- Product-specific sections: `webModeler`, `console`, etc.

**Environment Variables**

Added to YAML only if array exists and has items:
```js
if (answers.console_env_vars && answers.console_env_vars.length > 0) {
  config += `console:\n  env:\n`
  answers.console_env_vars.forEach(env => {
    config += `    - name: ${env.name}\n      value: ${env.value}\n`
  })
}
```

### YAML Structure Output
```yaml
global:                    # If Orchestration Cluster selected
  elasticsearch/opensearch:
    enabled: true
    external: true
    auth:
      username: "..."
      secret:
        password: "..."
    url:
      protocol: "..."
      host: "..."
      port: 9200

optimize:                  # If Optimize standalone
  elasticsearch/opensearch:
    ...

webModeler:               # If Web Modeler selected
  restapi:
    externalDatabase:
      ...

console:                  # Environment variables per product
  env:
    - name: VAR_NAME
      value: VAR_VALUE

orchestration:
  env:
    - name: VAR_NAME
      value: VAR_VALUE
```

---

## Adding New Features

This section describes how to extend the wizard with new functionality.

### Adding a New Product

**Step 1: Add to Product Selection**

Edit step 1's options array:
```js
options: [
  'Orchestration Cluster',
  'Connectors',
  'Optimize',
  'Management Identity',
  'Web Modeler',
  'Console',
  'New Product Name'  // Add here
]
```

**Step 2: Add Database Configuration Step (if needed)**
```js
{
  stepNumber: X,
  title: "New Product Database Configuration",
  showIf: (answers) => answers.products?.includes('New Product Name'),
  questions: [
    {
      id: 'newproduct_database',
      label: 'Select database for New Product',
      type: 'radio',
      options: ['PostgreSQL', 'MySQL'], // or whatever databases it supports
      required: true
    },
    // Add connection detail questions with showIf conditions
  ]
}
```

**Step 3: Add Environment Variables Step**
```js
{
  stepNumber: Y,
  title: "New Product Environment Variables",
  showIf: (answers) => answers.products?.includes('New Product Name'),
  questions: [
    {
      id: 'newproduct_env_vars',
      label: 'Add environment variables for New Product (optional)',
      type: 'env_vars'
    }
  ]
}
```

**Step 4: Add to YAML Generation**

In `generateYaml()` function:
```js
// Add database config section
if (answers.newproduct_database === 'PostgreSQL') {
  config += `newProduct:
  database:
    type: postgresql
    host: "${answers.newproduct_db_host}"
    port: 5432\n\n`
}

// Add environment variables section
if (answers.newproduct_env_vars && answers.newproduct_env_vars.length > 0) {
  config += `newProduct:\n  env:\n`
  answers.newproduct_env_vars.forEach(env => {
    config += `    - name: ${env.name}\n      value: ${env.value}\n`
  })
  config += '\n'
}
```

### Adding a New Question Type

**Step 1: Define Question Config**
```js
{
  id: 'example_dropdown',
  label: 'Select an option',
  type: 'dropdown',  // New type
  options: ['Option 1', 'Option 2', 'Option 3'],
  required: true
}
```

**Step 2: Add Handler in QuestionRenderer**
```js
function QuestionRenderer({ question, value, onChange }) {
  // ... existing handlers ...

  // Add new handler
  if (question.type === 'dropdown') {
    return (
      <div className="question-wrapper">
        <label>{question.label}</label>
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-- Select --</option>
          {question.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }
}
```

**Step 3: Add CSS Styling**
```css
.question-wrapper select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}
```

### Adding Validation

**Step 1: Create Validation Function**
```js
const validateStep = (stepData, answers) => {
  const errors = []
  
  stepData.questions.forEach(q => {
    if (q.required && !answers[q.id]) {
      errors.push(`${q.label} is required`)
    }
  })
  
  return errors
}
```

**Step 2: Call Before Navigation**
```js
function next() {
  const errors = validateStep(currentStepData, answers)
  
  if (errors.length > 0) {
    alert(errors.join('\n'))
    return
  }
  
  if (page < totalPages) {
    setPage(page + 1)
  }
}
```

### Adding Progress Persistence

**Step 1: Save to localStorage on Answer Change**
```js
const saveAnswer = (questionId, value) => {
  const newAnswers = {
    ...answers,
    [questionId]: value
  }
  
  setAnswers(newAnswers)
  
  // Save to localStorage
  localStorage.setItem('wizard_answers', JSON.stringify(newAnswers))
  localStorage.setItem('wizard_page', page)
  
  if (questionId === 'products') {
    setPage(1)
  }
}
```

**Step 2: Load from localStorage on Mount**
```js
const [answers, setAnswers] = useState(() => {
  const saved = localStorage.getItem('wizard_answers')
  return saved ? JSON.parse(saved) : {}
})

const [page, setPage] = useState(() => {
  const saved = localStorage.getItem('wizard_page')
  return saved ? parseInt(saved) : 1
})
```

**Step 3: Clear on Generate or Reset**
```js
const generateYaml = () => {
  // ... existing generation logic ...
  
  // Clear saved progress after successful generation
  localStorage.removeItem('wizard_answers')
  localStorage.removeItem('wizard_page')
}
```

### Adding a Download Feature

**Step 1: Install file-saver (optional)**
```bash
npm install file-saver
```

**Step 2: Create Download Function**
```js
const downloadYaml = () => {
  if (!yamlOutput || yamlOutput === 'No configuration generated yet...') {
    alert('Please generate configuration first')
    return
  }
  
  const blob = new Blob([yamlOutput], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'camunda-config.yaml'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

**Step 3: Add Download Button**
```jsx
<button className="download-button" onClick={downloadYaml}>
  Download YAML
</button>
```

---

## Development Guidelines

### Code Organization Principles

1. **Keep wizardSteps at the top** - It's the configuration that drives everything
2. **State declarations next** - Clear visibility of what data we're managing
3. **Computed values after state** - These derive from state
4. **Event handlers before render** - Functions that modify state
5. **Render last** - The JSX that displays everything

### Naming Conventions

**Question IDs:**
- Format: `{product}_{database_type}_{field_name}`
- Examples: `orchestration_cluster_es_username`, `optimize_os_host`
- Use underscores, not camelCase
- Match YAML structure where possible

**State Variables:**
- Use camelCase
- Be descriptive: `currentStepData` not `stepData`
- Boolean flags: `isLoading`, `hasError`

**Functions:**
- Use verbs: `saveAnswer`, `generateYaml`, `handleAdd`
- Event handlers: `handleClick`, `handleChange`

### When to Extract Components

Don't extract components too early. Extract when:
- Code is repeated 3+ times
- A section has its own complex logic
- File exceeds 600-800 lines
- Component has 5+ useState hooks

Current candidates for extraction (when needed):
- Database configuration form (repeated for each product)
- Navigation buttons
- YAML output panel

### Testing Recommendations

**Manual Testing Checklist:**
- Select each product individually
- Select multiple products together
- Test all database type combinations
- Add/edit/delete environment variables
- Navigate back and forth between steps
- Generate YAML at different stages
- Verify conditional steps appear/disappear correctly

**Edge Cases to Test:**
- Changing product selection mid-wizard
- Empty environment variable submissions
- Special characters in text fields
- Very long values
- Selecting then deselecting products

---

## Common Patterns Reference

### Adding a Conditional Question
```js
{
  id: 'question_id',
  label: 'Question text',
  type: 'text',
  showIf: (answers) => answers.some_other_question === 'specific_value',
  required: true
}
```

### Adding Multi-Level Conditionals
```js
showIf: (answers) => {
  const hasProductA = answers.products?.includes('Product A')
  const hasProductB = answers.products?.includes('Product B')
  const databaseType = answers.product_database
  
  return hasProductA && hasProductB && databaseType === 'PostgreSQL'
}
```

### Building Dynamic YAML Sections
```js
// Check if data exists
if (answers.product_config && answers.product_config.length > 0) {
  // Add parent key
  config += `product:\n`
  
  // Add sub-section
  config += `  subsection:\n`
  
  // Loop through array
  answers.product_config.forEach(item => {
    config += `    - name: ${item.name}\n`
    config += `      value: ${item.value}\n`
  })
  
  // Add spacing
  config += '\n'
}
```

---

## Troubleshooting Guide

### UI Not Updating After State Change

**Problem:** Changed state but screen doesn't update

**Solution:** Make sure you're using `setAnswers()`, not modifying `answers` directly
```js
// ❌ Wrong
answers.newField = 'value'

// ✅ Correct
setAnswers({ ...answers, newField: 'value' })
```

### Step Not Appearing

**Problem:** Added new step but it doesn't show

**Checklist:**
1. Is `showIf` condition correct?
2. Is the step being filtered out by `visibleSteps`?
3. Debug: `console.log(visibleSteps)` to see what's included
4. Check if `answers` has expected values: `console.log(answers)`

### YAML Not Generating Correctly

**Problem:** Generated YAML is malformed or missing sections

**Debug Steps:**
1. Check `answers` object: `console.log(answers)` before generation
2. Add console logs in `generateYaml()` to see which conditions are true
3. Verify question IDs match what you're checking in generation
4. Check for typos in product names or database types

### Environment Variables Not Saving

**Problem:** Added env vars but they don't persist

**Cause:** EnvironmentVariablesManager has local state that needs to sync

**Solution:** Make sure `onChange(newEnvVars)` is being called in all CRUD operations

---

## Future Enhancements

Ideas for future development (not yet implemented):

- [ ] Add form validation with error messages
- [ ] Implement progress saving to localStorage
- [ ] Add YAML download functionality
- [ ] Create a review/summary step before generation
- [ ] Add ability to import existing YAML for editing
- [ ] Implement undo/redo functionality
- [ ] Add configuration templates (dev, staging, production)
- [ ] Support for advanced/expert mode with all options
- [ ] Add help tooltips for each field
- [ ] Implement dark mode
- [ ] Add keyboard navigation support
- [ ] Create automated tests

---

## Resources

- [React Documentation](https://react.dev/)
- [Camunda 8 Helm Chart Documentation](https://github.com/camunda/camunda-platform-helm)
- [Camunda 8 Self-Managed Documentation](https://docs.camunda.io/docs/self-managed/about-self-managed/)

---

**Last Updated:** [Current Date]  
**Version:** 1.0.0  
**Maintained By:** [Your Name]