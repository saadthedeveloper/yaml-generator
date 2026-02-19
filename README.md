# Camunda 8 Configuration Wizard

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)

An interactive web-based wizard for generating production-ready YAML configuration files for Camunda 8 Self-Managed deployments.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration Output](#configuration-output)
- [Project Structure](#project-structure)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## About

The Camunda 8 Configuration Wizard simplifies the process of configuring Camunda 8 Self-Managed installations by providing an intuitive step-by-step interface. Instead of manually editing YAML files, users can select their required components, configure databases, and set environment variables through a guided workflow.

### Why This Tool?

- **Reduces Configuration Errors**: Guided form inputs with validation prevent common YAML syntax mistakes
- **Saves Time**: No need to reference documentation repeatedly or search for configuration examples
- **Dynamic Configuration**: Only shows relevant configuration steps based on selected products
- **Live Preview**: See your YAML configuration update in real-time as you make selections

## Features

### Product Selection
Support for all major Camunda 8 components:
- Zeebe Broker and Gateway (including Operate & Tasklist)
- Connectors
- Optimize
- Identity
- Web Modeler
- Console

### Database Configuration
- **Elasticsearch**: External Elasticsearch cluster configuration
- **OpenSearch**: External OpenSearch cluster configuration
- **PostgreSQL**: Database configuration for Identity and Web Modeler

### Environment Variables Management
- Add unlimited environment variables per product
- Edit and delete existing variables
- Support for Web Modeler sub-services:
  - REST API
  - Web App
  - WebSocket

### User Experience
- Conditional navigation - only relevant steps are shown
- Progress indicator showing current step
- Back/Next navigation with validation
- Live YAML output preview
- Fixed "Generate" button for instant config generation

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (or yarn v1.22.0+)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### Clone the Repository
```bash
git clone <repository-url>
cd camunda-config-wizard
```

### Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### Start Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

The application will start at `http://localhost:5173`

## Usage

### Step-by-Step Guide

1. **Product Selection**
   - Select the Camunda 8 products you want to deploy
   - Multiple products can be selected

2. **Database Configuration** (conditional)
   - Configure Elasticsearch or OpenSearch for Zeebe and Optimize
   - Configure PostgreSQL for Identity and Web Modeler
   - Provide connection details (host, credentials, protocol)

3. **Environment Variables** (optional)
   - Add custom environment variables for each selected product
   - Click "Done" to add a variable
   - Click "Edit" to modify existing variables
   - Click "Delete" to remove variables
   - Click "New" to start adding another variable

4. **Generate Configuration**
   - Click the "Generate" button (fixed at bottom-right)
   - View the generated YAML in the output panel
   - Copy the YAML for use in your deployment

### Example Workflow
```
Select Products → Configure Databases → Set Environment Variables → Generate YAML
```

## Configuration Output

The wizard generates a Helm values YAML file compatible with the [Camunda 8 Helm Chart](https://github.com/camunda/camunda-platform-helm).

### Sample Output Structure
```yaml
global:
  elasticsearch:
    enabled: true
    external: true
    auth:
      username: "elastic"
      secret:
        password: "your-password"
    url:
      protocol: "http"
      host: "elasticsearch.example.com"
      port: 9200
    clusterName: "elasticsearch"

orchestration:
  env:
    - name: ZEEBE_LOG_LEVEL
      value: DEBUG

optimize:
  env:
    - name: OPTIMIZE_LOG_LEVEL
      value: INFO

webModeler:
  restApi:
    externalDatabase:
      enabled: true
      url: "jdbc:postgresql://postgres.example.com:5432/web-modeler"
      host: "postgres.example.com"
      port: 5432
      database: "web-modeler"
      user: "modeler"
      password: "secure-password"
    env:
      - name: RESTAPI_LOG_LEVEL
        value: DEBUG
  webApp:
    env:
      - name: WEBAPP_LOG_LEVEL
        value: INFO
```

## Project Structure
```
camunda-config-wizard/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   └── main.jsx        # React entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Development

### Tech Stack

- **React 19.2.0**: UI framework
- **Vite 7.2.4**: Build tool and dev server
- **JavaScript (ES6+)**: Programming language
- **CSS3**: Styling

### Code Organization

The application is organized into three main sections in `App.jsx`:

1. **wizardSteps**: Configuration object defining all wizard steps and questions
2. **State Management**: React hooks for managing wizard state
3. **Components**:
   - `App`: Main wizard orchestrator
   - `EnvironmentVariablesManager`: Handles env var CRUD operations
   - `QuestionRenderer`: Renders different input types based on question type

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

### Building for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

## Roadmap

### Current Status
🚧 **Active Development** - Core functionality complete, additional features in progress

### Planned Features
- [ ] YAML file download functionality
- [ ] Configuration validation
- [ ] Save/load configuration drafts
- [ ] Import existing YAML for editing
- [ ] Configuration templates for common scenarios
- [ ] Support for additional Camunda 8 components
- [ ] Multi-language support
- [ ] Dark mode

## Contributing

This project is currently under active development as a client project. Contributions are not open at this time.

If you encounter issues or have suggestions, please contact the maintainer.

## License

Proprietary - All Rights Reserved

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

## Support

### Documentation
- [Camunda 8 Self-Managed Documentation](https://docs.camunda.io/docs/self-managed/about-self-managed/)
- [Camunda 8 Helm Charts](https://github.com/camunda/camunda-platform-helm)
- [Camunda Community Hub](https://github.com/camunda-community-hub)

### Getting Help
For questions or support regarding this tool:
- Create an issue in the repository
- Contact: [Your Email/Contact Info]

### Related Projects
- [Camunda Platform Helm Chart](https://github.com/camunda/camunda-platform-helm)
- [Camunda 8 Documentation](https://docs.camunda.io)

---

**Built with ❤️ for the Camunda Community**