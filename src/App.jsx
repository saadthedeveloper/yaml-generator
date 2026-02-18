import { useState } from 'react';
import './App.css'

function App() {
  // Question Object
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
      showIf: (answers) => answers.products?.includes('Zeebe Broker and Gateway (including: Operate & Tasklist)'),
      questions: [
        {
          id: 'zeebe_database',
          label: 'Select database for Zeebe Broker & Gateway',
          type: 'radio',
          options: ['Elasticsearch', 'OpenSearch'],
          required: true
        },
        // Elasticsearch fields
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
        // OpenSearch fields
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
        // Elasticsearch fields
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
        // OpenSearch fields
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
    // Environment Variables Steps
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

  // States
  const [page, setPage] = useState(1)
  const [answers, setAnswers] = useState({})
  const [yamlOutput, setYamlOutput] = useState('')

  // Filter visible steps based on answers
  const visibleSteps = wizardSteps.filter(step => {
    if (step.showIf) {
      return step.showIf(answers)
    }
    return true
  })

  const totalPages = visibleSteps.length
  const currentStepData = visibleSteps[page - 1]

  // Save answer function
  const saveAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })

    if (questionId === 'products') {
      setPage(1)
    }
  }

  // Navigation
  function next() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  function previous() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  // Generate YAML config
  const generateYaml = () => {
  let config = ''

  // Database configs (Elasticsearch/OpenSearch)
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

  // Web Modeler Database
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

  // Console environment variables
  if (answers.console_env_vars && answers.console_env_vars.length > 0) {
    config += `console:\n  env:\n`
    answers.console_env_vars.forEach(env => {
      config += `    - name: ${env.name}\n      value: ${env.value}\n`
    })
    config += '\n'
  }

  // Connectors environment variables
  if (answers.connectors_env_vars && answers.connectors_env_vars.length > 0) {
    config += `connectors:\n  env:\n`
    answers.connectors_env_vars.forEach(env => {
      config += `    - name: ${env.name}\n      value: ${env.value}\n`
    })
    config += '\n'
  }

  // Orchestration (Zeebe) environment variables
  if (answers.zeebe_env_vars && answers.zeebe_env_vars.length > 0) {
    config += `orchestration:\n  env:\n`
    answers.zeebe_env_vars.forEach(env => {
      config += `    - name: ${env.name}\n      value: ${env.value}\n`
    })
    config += '\n'
  }

  // Optimize environment variables
  if (answers.optimize_env_vars && answers.optimize_env_vars.length > 0) {
    config += `optimize:\n  env:\n`
    answers.optimize_env_vars.forEach(env => {
      config += `    - name: ${env.name}\n      value: ${env.value}\n`
    })
    config += '\n'
  }

  // Identity environment variables
  if (answers.identity_env_vars && answers.identity_env_vars.length > 0) {
    config += `identity:\n  env:\n`
    answers.identity_env_vars.forEach(env => {
      config += `    - name: ${env.name}\n      value: ${env.value}\n`
    })
    config += '\n'
  }

  // Web Modeler environment variables (3 sections)
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

  setYamlOutput(config || 'No configuration generated yet...')
}

  return (
    <main className="config-app">
      <header className='bread-crumb'>
        <p>Step {page} Of {totalPages}</p>
      </header>

      <section className="wizard-content">
        <h2>{currentStepData.title}</h2>

        {currentStepData.questions.map(q => {
          if (q.showIf && !q.showIf(answers)) return null

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

      {/* YAML Output */}
      <div className='output'>
        <pre>{yamlOutput || 'Config will appear here...'}</pre>
      </div>

      <nav className='app-navigation'>
        <button className="nav-button back-button" onClick={previous}>
          <i className="fa-solid fa-arrow-left arrow"></i>Back
        </button>
        <button className="nav-button next-button" onClick={next} disabled={page === totalPages}>
          Next<i className="fa-solid fa-arrow-right"></i>
        </button>
      </nav>

      {/* Generate button - always visible fixed bottom right */}
      <button className="generate-button" onClick={generateYaml}>Generate</button>
    </main>
  )
}

// Environment Variables Manager Component
function EnvironmentVariablesManager({ productId, value, onChange }) {
  const [envVars, setEnvVars] = useState(value || [])
  const [editingIndex, setEditingIndex] = useState(null)
  const [currentName, setCurrentName] = useState('')
  const [currentValue, setCurrentValue] = useState('')

  const handleAdd = () => {
    if (!currentName || !currentValue) return

    const newEnvVars = [...envVars, { name: currentName, value: currentValue }]
    setEnvVars(newEnvVars)
    onChange(newEnvVars)
    setCurrentName('')
    setCurrentValue('')
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
    setCurrentName(envVars[index].name)
    setCurrentValue(envVars[index].value)
  }

  const handleUpdate = () => {
    if (editingIndex === null) return

    const newEnvVars = [...envVars]
    newEnvVars[editingIndex] = { name: currentName, value: currentValue }
    setEnvVars(newEnvVars)
    onChange(newEnvVars)
    setEditingIndex(null)
    setCurrentName('')
    setCurrentValue('')
  }

  const handleDelete = (index) => {
    const newEnvVars = envVars.filter((_, i) => i !== index)
    setEnvVars(newEnvVars)
    onChange(newEnvVars)
  }

  const handleNew = () => {
    setEditingIndex(null)
    setCurrentName('')
    setCurrentValue('')
  }

  return (
    <div className="env-vars-manager">
      {/* List of existing env vars */}
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

      {/* Add/Edit form */}
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
          {editingIndex === null ? (
            <button onClick={handleAdd} className="done-btn">Done</button>
          ) : (
            <button onClick={handleUpdate} className="update-btn">Update</button>
          )}
          <button onClick={handleNew} className="new-btn">New</button>
        </div>
      </div>
    </div>
  )
}

// Question Renderer Component
function QuestionRenderer({ question, value, onChange }) {
  if (question.type === 'radio') {
    return (
      <div className="question-wrapper">
        <label>{question.label}</label>
        <div className="radio-group">
          {question.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={question.id}
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
                checked={value?.includes(opt)}
                onChange={(e) => {
                  const newValue = value || []
                  if (e.target.checked) {
                    onChange([...newValue, opt])
                  } else {
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

  if (question.type === 'text' || question.type === 'password') {
    return (
      <div className="question-wrapper text-input">
        <label>{question.label}</label>
        <input
          type={question.type}
          value={value || ''}
          placeholder={question.placeholder || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

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