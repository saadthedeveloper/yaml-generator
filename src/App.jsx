import { useState } from 'react';
// import yaml from 'js-yaml';
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
          options: ['PostgreSQL', 'MySQL'],
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
          label: 'Select database for Web Modeler',
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
    clusterName: "elasticsearch"\n`
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
    clusterName: "opensearch"\n`
  }

  if (answers.products?.includes('Web Modeler')) {
    config += `webModeler:
  restapi:
    externalDatabase:
      enabled: true
      url: "jdbc:postgresql://${answers.webmodeler_db_url}:5432/web-modeler"
      host: "${answers.webmodeler_db_host}"
      port: 5432
      database: "web-modeler"
      user: "${answers.webmodeler_db_user}"
      password: "${answers.webmodeler_db_password}"\n`
  }

  setYamlOutput(config)
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
        <button className="nav-button back-button" onClick={previous}>Back</button>
        <button className="nav-button next-button" onClick={next} disabled={page === totalPages}>Next</button>
      </nav>

      {/* Generate button - always visible fixed bottom right */}
      <button className="generate-button" onClick={generateYaml}>Generate</button>
    </main>
  )
}

// Question Renderer Component (outside App)
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
}

export default App;