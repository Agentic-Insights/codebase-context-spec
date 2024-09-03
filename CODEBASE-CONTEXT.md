# Codebase Context Specification

Specification Version: 1.0-RFC
Date: 2024-08-31

## 1. Overview

Codebase Context is a convention similar to .env and .editorconfig systems, but focused on documenting your code for both AI and humans. Just as .env files manage environment variables and .editorconfig ensures consistent coding styles, CCS files provide a standardized way to capture and communicate the context of your codebase.

This convention allows developers to:

1. Document high-level architecture and design decisions
2. Explain project-specific conventions and patterns
3. Highlight important relationships between different parts of the codebase
4. Provide context that might not be immediately apparent from the code itself
5. By adopting this convention, teams can ensure that both human developers and AI assistants have access to crucial contextual information, leading to better code understanding, more accurate suggestions, and improved overall development efficiency.

## 2. Key Principles

1. **Flexibility**: Support multiple file formats and context types.
2. **Proximity**: Keep context close to the code it describes.
3. **Hierarchy**: Allow for project-wide, directory-level, and file-specific context.
4. **Clarity**: Promote clear, maintainable context files.
5. **AI-Centric**: Optimize for AI model consumption and interpretation.

## 3. File Structure

### 3.1 File Names

Context files must use one of the following extensions:

- `.context.md`: Markdown format (default, supports both structured and unstructured content)
- `.context.yaml` or `.context.yml`: YAML format
- `.context.json`: JSON format

The `.md` extension is the default and recommended format as it supports both structured (via YAML front matter) and unstructured content.

### 3.2 File Locations

Context files can be placed at two levels within a project:

- Project root: For project-wide context
- Directories: For context specific to that directory and its contents

Example structure:

```
project_root/
├── .context.md
├── .contextignore
├── .contextdocs.md
├── src/
│   ├── .context.yaml
│   ├── module1/
│   │   └── .context.md
│   └── module2/
│       └── .context.json
└── tests/
    └── .context.md
```

## 4. File Formats

### 4.1 Markdown Format (Default)

Markdown files (.context.md) are the default and recommended format. They can include an optional YAML front matter for structured data, followed by free-form Markdown content. The structured data should now include role-specific sections.

Example:

```markdown
---
project-name: MyAwesomeProject
version: 1.0.0
description: A revolutionary web application
main-technologies:
  - Node.js
  - React
  - MongoDB
conventions:
  - Use consistent naming conventions within each file type
  - Each function should have a single responsibility
ai-prompts:
  - Focus on performance optimizations
  - Suggest ways to improve error handling
architecture:
  style: Microservices
  main-components:
    - Auth Service
    - User Service
    - Data Processing Service
  data-flow:
    - Client -> API Gateway -> Services -> Database
development:
  setup-steps:
    - Install Node.js v14+
    - Run `npm install` in each service directory
    - Set up MongoDB instance
  build-command: npm run build
  test-command: npm test
business-requirements:
  key-features:
    - User authentication
    - Real-time data processing
    - Mobile-responsive UI
  target-audience: Small to medium-sized businesses
  success-metrics:
    - User adoption rate
    - System response time
    - Data processing accuracy
quality-assurance:
  testing-frameworks:
    - Jest
    - Cypress
  coverage-threshold: 80%
  performance-benchmarks:
    - API response time < 200ms
    - Database query time < 100ms
deployment:
  platform: AWS
  cicd-pipeline: GitHub Actions
  staging-environment: dev.myawesomeproject.com
  production-environment: myawesomeproject.com
---

# MyAwesomeProject

This document provides comprehensive context for the MyAwesomeProject, a revolutionary web application designed to streamline business processes.

## Architecture Overview

MyAwesomeProject follows a microservices architecture, consisting of the following main components:

1. Auth Service: Handles user authentication and authorization.
2. User Service: Manages user profiles and preferences.
3. Data Processing Service: Processes and analyzes business data in real-time.

The system uses an API Gateway to route requests to appropriate services, ensuring scalability and maintainability.

## Development Guidelines

- Follow the conventions listed in the front matter.
- Use feature branches and pull requests for all changes.
- Write unit tests for all new features and bug fixes.
- Document all public APIs using JSDoc comments.

## Business Context

The primary goal of MyAwesomeProject is to provide small to medium-sized businesses with a powerful tool for real-time data analysis and visualization. Key features include:

- Secure user authentication
- Real-time data processing with customizable dashboards
- Mobile-responsive design for on-the-go access

Success will be measured by user adoption rates, system performance metrics, and data processing accuracy.

## Quality Assurance

Our QA process ensures high-quality, reliable software through:

- Comprehensive unit and integration testing using Jest
- End-to-end testing with Cypress
- Continuous integration and deployment via GitHub Actions
- Regular performance testing and optimization

## Deployment and Operations

MyAwesomeProject is deployed on AWS using a robust CI/CD pipeline:

1. Developers push code to GitHub
2. GitHub Actions run tests and build the application
3. Successful builds are deployed to the staging environment
4. After approval, changes are promoted to production

Monitoring and logging are handled through AWS CloudWatch and ELK stack.

```

### 4.2 YAML Format

YAML format (.context.yaml or .context.yml) should now include the expanded role-specific sections and use kebab-case for key names.

Example:

```yaml
project-name: MyAwesomeProject
version: 1.0.0
description: A revolutionary web application
main-technologies:
  - Node.js
  - React
  - MongoDB
conventions:
  - Use consistent naming conventions within each file type
  - Each function should have a single responsibility
ai-prompts:
  - Focus on performance optimizations
  - Suggest ways to improve error handling
architecture:
  style: Microservices
  main-components:
    - Auth Service
    - User Service
    - Data Processing Service
  data-flow:
    - Client -> API Gateway -> Services -> Database
development:
  setup-steps:
    - Install Node.js v14+
    - Run `npm install` in each service directory
    - Set up MongoDB instance
  build-command: npm run build
  test-command: npm test
business-requirements:
  key-features:
    - User authentication
    - Real-time data processing
    - Mobile-responsive UI
  target-audience: Small to medium-sized businesses
  success-metrics:
    - User adoption rate
    - System response time
    - Data processing accuracy
quality-assurance:
  testing-frameworks:
    - Jest
    - Cypress
  coverage-threshold: 80%
  performance-benchmarks:
    - API response time < 200ms
    - Database query time < 100ms
deployment:
  platform: AWS
  cicd-pipeline: GitHub Actions
  staging-environment: dev.myawesomeproject.com
  production-environment: myawesomeproject.com
```

### 4.3 JSON Format

JSON format (.context.json) should also include the expanded role-specific sections. Note that JSON doesn't support kebab-case for key names, so we'll use camelCase as it's a common convention in JSON.

Example:

```json
{
  "projectName": "MyAwesomeProject",
  "version": "1.0.0",
  "description": "A revolutionary web application",
  "mainTechnologies": [
    "Node.js",
    "React",
    "MongoDB"
  ],
  "conventions": [
    "Use consistent naming conventions within each file type",
    "Each function should have a single responsibility"
  ],
  "aiPrompts": [
    "Focus on performance optimizations",
    "Suggest ways to improve error handling"
  ],
  "architecture": {
    "style": "Microservices",
    "mainComponents": [
      "Auth Service",
      "User Service",
      "Data Processing Service"
    ],
    "dataFlow": [
      "Client -> API Gateway -> Services -> Database"
    ]
  },
  "development": {
    "setupSteps": [
      "Install Node.js v14+",
      "Run `npm install` in each service directory",
      "Set up MongoDB instance"
    ],
    "buildCommand": "npm run build",
    "testCommand": "npm test"
  },
  "businessRequirements": {
    "keyFeatures": [
      "User authentication",
      "Real-time data processing",
      "Mobile-responsive UI"
    ],
    "targetAudience": "Small to medium-sized businesses",
    "successMetrics": [
      "User adoption rate",
      "System response time",
      "Data processing accuracy"
    ]
  },
  "qualityAssurance": {
    "testingFrameworks": [
      "Jest",
      "Cypress"
    ],
    "coverageThreshold": "80%",
    "performanceBenchmarks": [
      "API response time < 200ms",
      "Database query time < 100ms"
    ]
  },
  "deployment": {
    "platform": "AWS",
    "cicdPipeline": "GitHub Actions",
    "stagingEnvironment": "dev.myawesomeproject.com",
    "productionEnvironment": "myawesomeproject.com"
  }
}
```

## 5. Context Accumulation

1. Context accumulates as you traverse deeper into the directory structure.
2. More specific contexts provide additional detail to broader contexts.
3. AI models should consider all relevant context files, prioritizing more specific contexts when appropriate.
4. There is no strict overriding; AI judges context relevance based on the query or task.

## 6. The .contextignore File

The `.contextignore` file, placed in the project root, excludes files or directories from context consideration.

### Syntax

- Uses glob patterns similar to `.gitignore`
- Lines starting with `#` are comments

Example:
```
# Ignore all .log files
*.log

# Ignore the entire build directory
build/

# Ignore all .test.js files
**/*.test.js

# Ignore a specific file
src/deprecated-module.js

# Ignore all files in any directory named 'temp'
**/temp/*
```

## 7. Security Considerations

1. Avoid including sensitive information (API keys, passwords) in context files.
2. Be cautious with proprietary algorithms or trade secrets.
3. Use `.gitignore` to exclude sensitive context files from version control if necessary.

## 8. The .contextdocs File

The `.contextdocs` file allows developers to specify external documentation sources that should be incorporated into the project's context. This feature is particularly useful for including documentation from dependencies, libraries, or related projects.

### 8.1 Location and Naming

- The `.contextdocs` file should be placed in the root directory of the project.
- It must use one of the following extensions:
  - `.contextdocs.md` (default, recommended)
  - `.contextdocs.yaml` or `.contextdocs.yml`
  - `.contextdocs.json`

### 8.2 File Structure

The `.contextdocs` file should contain an array of documentation sources. Each source can be:

- A file path relative to the project root
- A URL to a markdown file
- A package name with associated documentation files

### 8.3 Examples

#### Markdown Format (.contextdocs.md) - Default

```markdown
---
contextdocs:
  - name: TypeScript
    relationship: Main language for linter implementation
    resources:
      - Official Documentation: https://www.typescriptlang.org/docs/
      - TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
      - TypeScript Deep Dive: https://basarat.gitbook.io/typescript/

  - name: Node.js
    relationship: Runtime environment for TypeScript linter
    resources:
      - Official Documentation: https://nodejs.org/en/docs/
      - Getting Started Guide: https://nodejs.org/en/docs/guides/getting-started-guide/
      - Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

  - name: Jest
    relationship: Testing framework for TypeScript linter
    resources:
      - Official Documentation: https://jestjs.io/docs/getting-started
      - Testing TypeScript with Jest: https://basarat.gitbook.io/typescript/intro-1/jest
      - Jest with TypeScript in Node.js: https://stackoverflow.com/questions/54822273/how-to-use-jest-with-typescript-in-node-js
---

# Additional Documentation Notes

This section can include any free-form text to provide context about the listed documentation sources, their relevance to the project, or any other pertinent information.
```

#### YAML Format (.contextdocs.yaml)

```yaml
contextdocs:
  - name: TypeScript
    relationship: Main language for linter implementation
    resources:
      - Official Documentation: https://www.typescriptlang.org/docs/
      - TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
      - TypeScript Deep Dive: https://basarat.gitbook.io/typescript/

  - name: Node.js
    relationship: Runtime environment for TypeScript linter
    resources:
      - Official Documentation: https://nodejs.org/en/docs/
      - Getting Started Guide: https://nodejs.org/en/docs/guides/getting-started-guide/
      - Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

  - name: Jest
    relationship: Testing framework for TypeScript linter
    resources:
      - Official Documentation: https://jestjs.io/docs/getting-started
      - Testing TypeScript with Jest: https://basarat.gitbook.io/typescript/intro-1/jest
      - Jest with TypeScript in Node.js: https://stackoverflow.com/questions/54822273/how-to-use-jest-with-typescript-in-node-js
```

#### JSON Format (.contextdocs.json)

```json
{
  "contextdocs": [
    {
      "name": "TypeScript",
      "relationship": "Main language for linter implementation",
      "resources": [
        {
          "Official Documentation": "https://www.typescriptlang.org/docs/"
        },
        {
          "TypeScript Handbook": "https://www.typescriptlang.org/docs/handbook/intro.html"
        },
        {
          "TypeScript Deep Dive": "https://basarat.gitbook.io/typescript/"
        }
      ]
    },
    {
      "name": "Node.js",
      "relationship": "Runtime environment for TypeScript linter",
      "resources": [
        {
          "Official Documentation": "https://nodejs.org/en/docs/"
        },
        {
          "Getting Started Guide": "https://nodejs.org/en/docs/guides/getting-started-guide/"
        },
        {
          "Node.js Best Practices": "https://github.com/goldbergyoni/nodebestpractices"
        }
      ]
    },
    {
      "name": "Jest",
      "relationship": "Testing framework for TypeScript linter",
      "resources": [
        {
          "Official Documentation": "https://jestjs.io/docs/getting-started"
        },
        {
          "Testing TypeScript with Jest": "https://basarat.gitbook.io/typescript/intro-1/jest"
        },
        {
          "Jest with TypeScript in Node.js": "https://stackoverflow.com/questions/54822273/how-to-use-jest-with-typescript-in-node-js"
        }
      ]
    }
  ]
}
```

### 8.4 Behavior

- When an AI model or related tool is processing the project context, it should fetch and incorporate the specified documentation.
- For local files, the content should be read from the specified path.
- For URLs, the content should be fetched from the provided URL.
- For packages, the documentation should be fetched from the package's repository or documentation site, based on the package name and version.

### 8.5 Use Cases

- Including documentation for key dependencies
- Referencing company-wide coding standards or guidelines
- Incorporating design documents or architectural overviews
- Linking to relevant external resources or tutorials

### 8.6 Considerations

- Ensure that URLs point to stable, version-controlled documentation to maintain consistency.
- Be mindful of the total volume of documentation to avoid overwhelming the AI model with irrelevant information.
- Regularly review and update the `.contextdocs` file to ensure all referenced documentation remains relevant and up-to-date.
- Consider implementing caching mechanisms for external documentation to improve performance and reduce network requests.

## 9. Conclusion

The Codebase Context Specification provides a flexible, standardized approach to enriching codebases with contextual information for AI models. By adopting this convention and including role-specific information, development teams can enhance AI-assisted workflows, improving code quality and development efficiency across projects of any scale or complexity. The addition of role-specific guidelines and consistent naming conventions ensures that AI models have access to comprehensive, relevant, and well-structured information tailored to different aspects of the software development lifecycle.

## 10. TypeScript Linter Implementation

For details on the TypeScript implementation of the linter for validating Codebase Context Specification files, please refer to the [TypeScript Linter README](linters/typescript/README.md).
