import { useState } from 'react';
import './App.css'

function App() {

  // ─── WIZARD STEPS CONFIG ──────────────────────────────────────────────────
  // This array defines every step (page) in the wizard.
  // Each step has:
  //   - stepNumber: used for reference
  //   - title: displayed as the heading on that page
  //   - showIf: optional function — if it returns false, the step is skipped entirely
  //   - questions: array of question objects to render on that step
  //
  // Each question has:
  //   - id: unique key used to store the answer in state
  //   - label: the text shown above the input
  //   - type: determines which input to render ('radio', 'checkbox', 'text', 'password', 'env_vars')
  //   - options: array of choices (for radio/checkbox types)
  //   - placeholder: hint text inside text inputs
  //   - required: whether the field must be filled (not enforced yet, just flagged)
  //   - showIf: optional function — if it returns false, this individual question is hidden

  const wizardSteps = [
    {
      stepNumber: 1,
      title: "Product Selection",
      questions: [
        {
          id: 'products',
          label: 'Select the products you need:',
          type: 'checkbox',
          options: [
            'Zeebe Broker and Gateway (including: Operate & Tasklist)',
            'Connectors',
            'Optimize',
            'Identity',
            'Web Modeler',
            'Console'
          ],
          required: true
        }
      ]
    },
    {
      stepNumber: 2,
      title: "Zeebe Database Configuration",
      // Only show this step if the user selected Zeebe in step 1
      showIf: (answers) => answers.products?.includes('Zeebe Broker and Gateway (including: Operate & Tasklist)'),
      questions: [
        {
          id: 'zeebe_database',
          label: 'Select database for Zeebe Broker & Gateway',
          type: 'radio',
          options: ['Elasticsearch', 'OpenSearch'],
          required: true
        },
        // --- Elasticsearch fields (only shown if Elasticsearch is selected) ---
        {
          id: 'zeebe_es_username',
          label: 'Elasticsearch Username',
          type: 'text',
          placeholder: 'elastic',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'Elasticsearch'
        },
        {
          id: 'zeebe_es_protocol',
          label: 'Protocol',
          type: 'text',
          placeholder: 'http',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'Elasticsearch'
        },
        {
          id: 'zeebe_es_password',
          label: 'Password',
          type: 'password',
          placeholder: 'your-password',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'Elasticsearch'
        },
        {
          id: 'zeebe_es_host',
          label: 'Host',
          type: 'text',
          placeholder: 'elasticsearch.example.com',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'Elasticsearch'
        },
        // --- OpenSearch fields (only shown if OpenSearch is selected) ---
        {
          id: 'zeebe_os_username',
          label: 'OpenSearch Username',
          type: 'text',
          placeholder: 'elastic',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'OpenSearch'
        },
        {
          id: 'zeebe_os_protocol',
          label: 'Protocol',
          type: 'text',
          placeholder: 'https',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'OpenSearch'
        },
        {
          id: 'zeebe_os_password',
          label: 'Password',
          type: 'password',
          placeholder: 'your-os-password',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'OpenSearch'
        },
        {
          id: 'zeebe_os_host',
          label: 'Host',
          type: 'text',
          placeholder: 'your-os-cluster.example.com',
          required: true,
          showIf: (answers) => answers.zeebe_database === 'OpenSearch'
        }
      ]
    },
    {
      stepNumber: 3,
      title: "Optimize Database Configuration",
      showIf: (answers) => answers.products?.includes('Optimize'),
      questions: [
        {
          id: 'optimize_database',
          label: 'Select database for Optimize',
          type: 'radio',
          options: ['Elasticsearch', 'OpenSearch'],
          required: true
        },
        // --- Elasticsearch fields ---
        {
          id: 'optimize_es_username',
          label: 'Elasticsearch Username',
          type: 'text',
          placeholder: 'elastic',
          required: true,
          showIf: (answers) => answers.optimize_database === 'Elasticsearch'
        },
        {
          id: 'optimize_es_protocol',
          label: 'Protocol',
          type: 'text',
          placeholder: 'http',
          required: true,
          showIf: (answers) => answers.optimize_database === 'Elasticsearch'
        },
        {
          id: 'optimize_es_password',
          label: 'Password',
          type: 'password',
          placeholder: 'your-password',
          required: true,
          showIf: (answers) => answers.optimize_database === 'Elasticsearch'
        },
        {
          id: 'optimize_es_host',
          label: 'Host',
          type: 'text',
          placeholder: 'elasticsearch.example.com',
          required: true,
          showIf: (answers) => answers.optimize_database === 'Elasticsearch'
        },
        // --- OpenSearch fields ---
        {
          id: 'optimize_os_username',
          label: 'OpenSearch Username',
          type: 'text',
          placeholder: 'elastic',
          required: true,
          showIf: (answers) => answers.optimize_database === 'OpenSearch'
        },
        {
          id: 'optimize_os_protocol',
          label: 'Protocol',
          type: 'text',
          placeholder: 'https',
          required: true,
          showIf: (answers) => answers.optimize_database === 'OpenSearch'
        },
        {
          id: 'optimize_os_password',
          label: 'Password',
          type: 'password',
          placeholder: 'your-os-password',
          required: true,
          showIf: (answers) => answers.optimize_database === 'OpenSearch'
        },
        {
          id: 'optimize_os_host',
          label: 'Host',
          type: 'text',
          placeholder: 'your-os-cluster.example.com',
          required: true,
          showIf: (answers) => answers.optimize_database === 'OpenSearch'
        }
      ]
    },
    {
      stepNumber: 4,
      title: "Identity Database Configuration",
      showIf: (answers) => answers.products?.includes('Identity'),
      questions: [
        {
          id: 'identity_database',
          label: 'Select database for Identity',
          type: 'radio',
          options: ['PostgreSQL'],
          required: true
        }
      ]
    },
    {
      stepNumber: 5,
      title: "Web Modeler Database Configuration",
      showIf: (answers) => answers.products?.includes('Web Modeler'),
      questions: [
        {
          id: 'webmodeler_database',
          label: 'Select database for Web Modeler (only for REST API)',
          type: 'radio',
          options: ['PostgreSQL'],
          required: true
        },
        // These fields only appear once PostgreSQL is selected above
        {
          id: 'webmodeler_db_url',
          label: 'Database URL',
          type: 'text',
          placeholder: 'your-postgres-host.example.com',
          required: true,
          showIf: (answers) => answers.webmodeler_database === 'PostgreSQL'
        },
        {
          id: 'webmodeler_db_host',
          label: 'Host',
          type: 'text',
          placeholder: 'your-postgres-host.example.com',
          required: true,
          showIf: (answers) => answers.webmodeler_database === 'PostgreSQL'
        },
        {
          id: 'webmodeler_db_user',
          label: 'User',
          type: 'text',
          placeholder: 'webmodeler-user',
          required: true,
          showIf: (answers) => answers.webmodeler_database === 'PostgreSQL'
        },
        {
          id: 'webmodeler_db_password',
          label: 'Password',
          type: 'password',
          placeholder: 'mypassword',
          required: true,
          showIf: (answers) => answers.webmodeler_database === 'PostgreSQL'
        }
      ]
    },

    // ─── ENVIRONMENT VARIABLE STEPS ─────────────────────────────────────────
    // One step per product, each using the custom 'env_vars' question type
    // which renders the EnvironmentVariablesManager component.
    // These steps are all optional — users can skip them without adding anything.

    {
      stepNumber: 6,
      title: "Zeebe Environment Variables",
      showIf: (answers) => answers.products?.includes('Zeebe Broker and Gateway (including: Operate & Tasklist)'),
      questions: [
        {
          id: 'zeebe_env_vars',
          label: 'Add environment variables for Zeebe (optional)',
          type: 'env_vars'
        }
      ]
    },
    {
      stepNumber: 7,
      title: "Connectors Environment Variables",
      showIf: (answers) => answers.products?.includes('Connectors'),
      questions: [
        {
          id: 'connectors_env_vars',
          label: 'Add environment variables for Connectors (optional)',
          type: 'env_vars'
        }
      ]
    },
    {
      stepNumber: 8,
      title: "Optimize Environment Variables",
      showIf: (answers) => answers.products?.includes('Optimize'),
      questions: [
        {
          id: 'optimize_env_vars',
          label: 'Add environment variables for Optimize (optional)',
          type: 'env_vars'
        }
      ]
    },
    {
      stepNumber: 9,
      title: "Identity Environment Variables",
      showIf: (answers) => answers.products?.includes('Identity'),
      questions: [
        {
          id: 'identity_env_vars',
          label: 'Add environment variables for Identity (optional)',
          type: 'env_vars'
        }
      ]
    },
    {
      stepNumber: 10,
      title: "Web Modeler Environment Variables",
      showIf: (answers) => answers.products?.includes('Web Modeler'),
      // Web Modeler has three separate services, each with their own env vars
      questions: [
        {
          id: 'webmodeler_restapi_env_vars',
          label: 'REST API Environment Variables (optional)',
          type: 'env_vars'
        },
        {
          id: 'webmodeler_webapp_env_vars',
          label: 'Web App Environment Variables (optional)',
          type: 'env_vars'
        },
        {
          id: 'webmodeler_websocket_env_vars',
          label: 'WebSocket Environment Variables (optional)',
          type: 'env_vars'
        }
      ]
    },
    {
      stepNumber: 11,
      title: "Console Environment Variables",
      showIf: (answers) => answers.products?.includes('Console'),
      questions: [
        {
          id: 'console_env_vars',
          label: 'Add environment variables for Console (optional)',
          type: 'env_vars'
        }
      ]
    }
  ]


  // ─── STATE ────────────────────────────────────────────────────────────────
  // useState returns [currentValue, setterFunction].
  // Calling the setter causes React to re-render the component with the new value.

  const [page, setPage] = useState(1)         // Which wizard step the user is on (1-based)
  const [answers, setAnswers] = useState({})   // All user answers, keyed by question id
  const [yamlOutput, setYamlOutput] = useState('') // The generated YAML string to display


  // ─── DERIVED VALUES ───────────────────────────────────────────────────────
  // These are calculated fresh on every render — no need to store them in state.

  // Filter out steps whose showIf condition returns false, so we only show relevant steps
  const visibleSteps = wizardSteps.filter(step => {
    if (step.showIf) {
      return step.showIf(answers)
    }
    return true // Steps without a showIf are always visible
  })

  const totalPages = visibleSteps.length
  const currentStepData = visibleSteps[page - 1] // page is 1-based, arrays are 0-based


  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  // Called by QuestionRenderer whenever the user changes an answer.
  // Spreads existing answers and overwrites just the changed question's value.
  const saveAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })

    // If the user changes their product selection, reset to page 1.
    // This prevents them from being on a step that no longer exists.
    if (questionId === 'products') {
      setPage(1)
    }
  }

  // Move to the next step (won't go past the last step)
  function next() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  // Move to the previous step (won't go below step 1)
  function previous() {
    if (page > 1) {
      setPage(page - 1)
    }
  }


  // ─── YAML GENERATOR ───────────────────────────────────────────────────────
  // Builds a YAML configuration string from the collected answers.
  // Each section is only added if the relevant product/database was selected.

  const generateYaml = () => {
    let config = ''

    // Global database config — only one of these will be added depending on
    // which database the user selected for Zeebe
    if (answers.zeebe_database === 'Elasticsearch') {
      config += `global:
  elasticsearch:
    enabled: true
    external: true
    auth:
      username: "${answers.zeebe_es_username}"
      secret:
        password: "${answers.zeebe_es_password}"
    url:
      protocol: "${answers.zeebe_es_protocol}"
      host: "${answers.zeebe_es_host}"
      port: 9200
    clusterName: "elasticsearch"\n\n`
    }

    if (answers.zeebe_database === 'OpenSearch') {
      config += `global:
  opensearch:
    enabled: true
    external: true
    auth:
      username: "${answers.zeebe_os_username}"
      secret:
        password: "${answers.zeebe_os_password}"
    url:
      protocol: "${answers.zeebe_os_protocol}"
      host: "${answers.zeebe_os_host}"
      port: 9200
    clusterName: "opensearch"\n\n`
    }

    // Web Modeler database section (only if Web Modeler was selected and PostgreSQL chosen)
    if (answers.products?.includes('Web Modeler') && answers.webmodeler_database === 'PostgreSQL') {
      config += `webModeler:
  restapi:
    externalDatabase:
      enabled: true
      url: "jdbc:postgresql://${answers.webmodeler_db_url}:5432/web-modeler"
      host: "${answers.webmodeler_db_host}"
      port: 5432
      database: "web-modeler"
      user: "${answers.webmodeler_db_user}"
      password: "${answers.webmodeler_db_password}"\n\n`
    }

    // Helper pattern used for each product's env vars below:
    // Only add the section if the array exists and has at least one entry.

    if (answers.console_env_vars && answers.console_env_vars.length > 0) {
      config += `console:\n  env:\n`
      answers.console_env_vars.forEach(env => {
        config += `    - name: ${env.name}\n      value: ${env.value}\n`
      })
      config += '\n'
    }

    if (answers.connectors_env_vars && answers.connectors_env_vars.length > 0) {
      config += `connectors:\n  env:\n`
      answers.connectors_env_vars.forEach(env => {
        config += `    - name: ${env.name}\n      value: ${env.value}\n`
      })
      config += '\n'
    }

    if (answers.zeebe_env_vars && answers.zeebe_env_vars.length > 0) {
      config += `orchestration:\n  env:\n`
      answers.zeebe_env_vars.forEach(env => {
        config += `    - name: ${env.name}\n      value: ${env.value}\n`
      })
      config += '\n'
    }

    if (answers.optimize_env_vars && answers.optimize_env_vars.length > 0) {
      config += `optimize:\n  env:\n`
      answers.optimize_env_vars.forEach(env => {
        config += `    - name: ${env.name}\n      value: ${env.value}\n`
      })
      config += '\n'
    }

    if (answers.identity_env_vars && answers.identity_env_vars.length > 0) {
      config += `identity:\n  env:\n`
      answers.identity_env_vars.forEach(env => {
        config += `    - name: ${env.name}\n      value: ${env.value}\n`
      })
      config += '\n'
    }

    // Web Modeler has three sub-sections (restApi, webApp, websocket).
    // We use a flag to avoid writing the 'webModeler:' parent key more than once.
    let webModelerEnvAdded = false

    if (answers.webmodeler_restapi_env_vars && answers.webmodeler_restapi_env_vars.length > 0) {
      if (!webModelerEnvAdded) {
        config += `webModeler:\n`
        webModelerEnvAdded = true
      }
      config += `  restApi:\n    env:\n`
      answers.webmodeler_restapi_env_vars.forEach(env => {
        config += `      - name: ${env.name}\n        value: ${env.value}\n`
      })
    }

    if (answers.webmodeler_webapp_env_vars && answers.webmodeler_webapp_env_vars.length > 0) {
      if (!webModelerEnvAdded) {
        config += `webModeler:\n`
        webModelerEnvAdded = true
      }
      config += `  webApp:\n    env:\n`
      answers.webmodeler_webapp_env_vars.forEach(env => {
        config += `      - name: ${env.name}\n        value: ${env.value}\n`
      })
    }

    if (answers.webmodeler_websocket_env_vars && answers.webmodeler_websocket_env_vars.length > 0) {
      if (!webModelerEnvAdded) {
        config += `webModeler:\n`
        webModelerEnvAdded = true
      }
      config += `  websocket:\n    env:\n`
      answers.webmodeler_websocket_env_vars.forEach(env => {
        config += `      - name: ${env.name}\n        value: ${env.value}\n`
      })
    }

    // If nothing was configured, show a fallback message instead of blank output
    setYamlOutput(config || 'No configuration generated yet...')
  }


  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <main className="config-app">

      {/* Step counter shown in the breadcrumb pill at the top */}
      <header className='bread-crumb'>
        <p>Step {page} Of {totalPages}</p>
      </header>

      {/* Main content area — renders the current step's title and questions */}
      <section className="wizard-content">
        <h2>{currentStepData.title}</h2>

        {currentStepData.questions.map(q => {
          // If a question has a showIf condition that returns false, skip rendering it
          if (q.showIf && !q.showIf(answers)) return null

          // QuestionRenderer decides which input type to render based on q.type
          return (
            <QuestionRenderer
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(val) => saveAnswer(q.id, val)}
            />
          )
        })}
      </section>

      {/* Fixed panel at the bottom-left showing the live YAML output */}
      <div className='output'>
        <pre>{yamlOutput || 'Config will appear here...'}</pre>
      </div>

      {/* Back/Next navigation buttons, fixed vertically centred on the sides */}
      <nav className='app-navigation'>
        <button className="nav-button back-button" onClick={previous}>
          <i className="fa-solid fa-arrow-left arrow"></i>Back
        </button>
        {/* disabled when on the last step so the user can't go past the end */}
        <button className="nav-button next-button" onClick={next} disabled={page === totalPages}>
          Next<i className="fa-solid fa-arrow-right"></i>
        </button>
      </nav>

      {/* Fixed Generate button — always visible, triggers YAML generation */}
      <button className="generate-button" onClick={generateYaml}>Generate</button>

    </main>
  )
}


// ─── ENVIRONMENT VARIABLES MANAGER ──────────────────────────────────────────
// A self-contained component for managing a list of name/value env var pairs.
// Props:
//   - productId: the question id (not used in rendering, but available if needed)
//   - value: the current array of env var objects [{ name, value }, ...]
//   - onChange: callback to pass the updated array back up to App's state

function EnvironmentVariablesManager({ productId, value, onChange }) {

  // Local copy of the env var list — kept in sync with the parent via onChange
  const [envVars, setEnvVars] = useState(value || [])

  // Tracks which item is being edited (by index), or null if we're adding a new one
  const [editingIndex, setEditingIndex] = useState(null)

  // Controlled input state for the name/value fields in the form
  const [currentName, setCurrentName] = useState('')
  const [currentValue, setCurrentValue] = useState('')

  // Add a new env var from the current form values
  const handleAdd = () => {
    if (!currentName || !currentValue) return // Don't add if either field is empty

    const newEnvVars = [...envVars, { name: currentName, value: currentValue }]
    setEnvVars(newEnvVars)
    onChange(newEnvVars) // Notify parent so it gets saved into App's answers state
    setCurrentName('')
    setCurrentValue('')
  }

  // Populate the form with an existing env var's values so the user can edit it
  const handleEdit = (index) => {
    setEditingIndex(index)
    setCurrentName(envVars[index].name)
    setCurrentValue(envVars[index].value)
  }

  // Save the edited values back into the list at the same index
  const handleUpdate = () => {
    if (editingIndex === null) return

    const newEnvVars = [...envVars]
    newEnvVars[editingIndex] = { name: currentName, value: currentValue }
    setEnvVars(newEnvVars)
    onChange(newEnvVars)

    // Reset to "add new" mode
    setEditingIndex(null)
    setCurrentName('')
    setCurrentValue('')
  }

  // Remove an env var by filtering it out by index
  const handleDelete = (index) => {
    const newEnvVars = envVars.filter((_, i) => i !== index)
    setEnvVars(newEnvVars)
    onChange(newEnvVars)
  }

  // Cancel editing and clear the form, ready to add a new entry
  const handleNew = () => {
    setEditingIndex(null)
    setCurrentName('')
    setCurrentValue('')
  }

  return (
    <div className="env-vars-manager">

      {/* List of already-added env vars with Edit and Delete buttons */}
      <div className="env-vars-list">
        {envVars.map((env, index) => (
          <div key={index} className="env-var-item">
            <span><strong>{env.name}</strong> = {env.value}</span>
            <div className="env-var-actions">
              <button onClick={() => handleEdit(index)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form — the button label changes based on whether we're editing */}
      <div className="env-var-form">
        <input
          type="text"
          placeholder="Name"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />

        <div className="env-form-buttons">
          {/* Show 'Done' (add) when not editing, 'Update' when editing an existing entry */}
          {editingIndex === null ? (
            <button onClick={handleAdd} className="done-btn">Done</button>
          ) : (
            <button onClick={handleUpdate} className="update-btn">Update</button>
          )}
          {/* New clears the form and exits edit mode */}
          <button onClick={handleNew} className="new-btn">New</button>
        </div>
      </div>

    </div>
  )
}


// ─── QUESTION RENDERER ────────────────────────────────────────────────────────
// A pure presentational component — it doesn't manage any state itself.
// It receives a question object and renders the appropriate input type.
// Props:
//   - question: the question config object from wizardSteps
//   - value: the current answer value from App's answers state
//   - onChange: callback to pass the new value up to App

function QuestionRenderer({ question, value, onChange }) {

  // Radio buttons — user picks exactly one option
  if (question.type === 'radio') {
    return (
      <div className="question-wrapper">
        <label>{question.label}</label>
        <div className="radio-group">
          {question.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={question.id}  // Grouping by name ensures only one can be selected
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    )
  }

  // Checkboxes — user can pick multiple options
  if (question.type === 'checkbox') {
    return (
      <div className="question-wrapper">
        <label>{question.label}</label>
        <div className="checkbox-group">
          {question.options.map(opt => (
            <label key={opt}>
              <input
                type="checkbox"
                value={opt}
                checked={value?.includes(opt)} // value is an array for checkboxes
                onChange={(e) => {
                  const newValue = value || []
                  if (e.target.checked) {
                    // Add this option to the array
                    onChange([...newValue, opt])
                  } else {
                    // Remove this option from the array
                    onChange(newValue.filter(v => v !== opt))
                  }
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    )
  }

  // Text or password input — single line free-text entry
  if (question.type === 'text' || question.type === 'password') {
    return (
      <div className="question-wrapper text-input">
        <label>{question.label}</label>
        <input
          type={question.type} // Passes 'text' or 'password' directly to the input
          value={value || ''}
          placeholder={question.placeholder || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  // Environment variables — renders the EnvironmentVariablesManager component
  if (question.type === 'env_vars') {
    return (
      <div className="question-wrapper">
        <label>{question.label}</label>
        <EnvironmentVariablesManager
          productId={question.id}
          value={value}
          onChange={onChange}
        />
      </div>
    )
  }
}

export default App;