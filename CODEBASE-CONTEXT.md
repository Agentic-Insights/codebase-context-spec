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

<div align="center">

[`.context.md`](#markdown-format-default "Markdown format (default, supports both structured and unstructured content)") | [`.context.yaml`](#yaml-format "YAML format") or [`.context.yml`](#yaml-format "YAML format") | [`.context.json`](#json-format "JSON format")

</div>

The `.context.md` extension is the default and recommended format as it supports both structured (via YAML front matter) and unstructured content.

### 3.2 File Locations

Context files can be placed at multiple levels within a project:

- Project root: For project-wide context (highly recommended)
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
module-name: Codebase Context Specification
version: 1.0.0
description: A specification for providing explicit context information about a codebase
related-modules:
  - name: Context Editor
    path: ./examples/context-editor
  - name: TypeScript Linter
    path: https://github.com/Agentic-Insights/codebase-context-spec/tree/main/linters/typescript
main-technologies:
  - Markdown
  - YAML
  - JSON
  - TypeScript
conventions:
  - Follow Markdown best practices
  - Use YAML for structured data
  - Consistent naming conventions
  - Use lowercase and underscores for all .ts files
architecture:
  style: Documentation-driven
  main-components:
    - Specification document
    - Context Editor
    - TypeScript Linter
  data-flow: 
    - Codebase -> .context.md files -> Linter -> Validation results
development:
  setup-steps:
    - Clone the repository
    - Review the specification documents
    - Install linter dependencies
  build-command: npm run build
  test-command: npm test
business-requirements:
  key-features:
    - Provide a standardized format for codebase context
    - Enable AI-assisted development with explicit context
    - Support multiple programming languages and frameworks
  target-audience: Developers and AI assistants
  success-metrics:
    - Adoption rate among developers
    - Improved AI-assisted development accuracy
quality-assurance:
  testing-frameworks:
    - Jest
    - Pytest
  coverage-threshold: "90%"
  performance-benchmarks:
    - Linting speed for large codebases
    - Memory usage during linting
deployment:
  platform: GitHub
  cicd-pipeline: GitHub Actions
  staging-environment: GitHub Pages (Documentation)
  production-environment: npm registry (Linter package)
---

# Codebase Context Specification

This document provides comprehensive context for the Codebase Context Specification project, which defines a standardized way to provide explicit context information about a codebase, enabling more effective AI-assisted development.

## Architecture Overview

The Codebase Context Specification follows a documentation-driven architecture, consisting of the following main components:

1. Specification Document: The core definition of the Codebase Context format and usage.
2. Context Editor: A tool for creating and editing .context.md files.
3. TypeScript Linter: A linter implementation to validate .context.md files against the specification.

The data flow in this system is as follows:
Codebase -> .context.md files -> Linter -> Validation results

This architecture ensures that the specification is well-defined, easy to implement, and can be validated automatically.

## Development Guidelines

- Follow the conventions listed in the front matter, including Markdown best practices and consistent naming conventions.
- Use YAML for structured data within the .context.md files.
- When contributing to the TypeScript linter, use lowercase and underscores for all .ts files.
- Write clear, concise documentation for all components of the specification.
- Use feature branches and pull requests for all changes to the specification or related tools.

## Business Context

The primary goal of the Codebase Context Specification is to provide developers and AI assistants with a standardized format for capturing and communicating codebase context. Key features include:

- A flexible, hierarchical structure for context information
- Support for multiple file formats (Markdown, YAML, JSON)
- Integration with existing development workflows

Success will be measured by the adoption rate among developers and the improvement in AI-assisted development accuracy when using the Codebase Context Specification.

## Quality Assurance

Our QA process ensures high-quality, reliable tools and documentation through:

- Comprehensive unit and integration testing using Jest and Pytest
- Maintaining a test coverage threshold of 90%
- Performance benchmarking for linting speed and memory usage
- Regular review and updates to the specification based on community feedback

## Deployment and Operations

The Codebase Context Specification project is managed and deployed as follows:

1. The specification and related tools are hosted on GitHub
2. GitHub Actions are used for continuous integration and deployment
3. Documentation is hosted on GitHub Pages (staging environment)
4. The TypeScript linter is published as an npm package (production environment)

Regular updates and maintenance are performed to keep the specification and tools up-to-date with evolving development practices and AI capabilities.
```

### 4.2 YAML Format

YAML format (.context.yaml or .context.yml) should now include the expanded role-specific sections and use kebab-case for key names.

Example:

```yaml
module-name: Codebase Context Specification
version: 1.0.0
description: A specification for providing explicit context information about a codebase
related-modules:
  - name: Context Editor
    path: ./examples/context-editor
  - name: TypeScript Linter
    path: https://github.com/Agentic-Insights/codebase-context-spec/tree/main/linters/typescript
main-technologies:
  - Markdown
  - YAML
  - JSON
  - TypeScript
conventions:
  - Follow Markdown best practices
  - Use YAML for structured data
  - Consistent naming conventions
  - Use lowercase and underscores for all .ts files
architecture:
  style: Documentation-driven
  main-components:
    - Specification document
    - Context Editor
    - TypeScript Linter
  data-flow: 
    - Codebase -> .context.md files -> Linter -> Validation results
development:
  setup-steps:
    - Clone the repository
    - Review the specification documents
    - Install linter dependencies
  build-command: npm run build
  test-command: npm test
business-requirements:
  key-features:
    - Provide a standardized format for codebase context
    - Enable AI-assisted development with explicit context
    - Support multiple programming languages and frameworks
  target-audience: Developers and AI assistants
  success-metrics:
    - Adoption rate among developers
    - Improved AI-assisted development accuracy
quality-assurance:
  testing-frameworks:
    - Jest
    - Pytest
  coverage-threshold: "90%"
  performance-benchmarks:
    - Linting speed for large codebases
    - Memory usage during linting
deployment:
  platform: GitHub
  cicd-pipeline: GitHub Actions
  staging-environment: GitHub Pages (Documentation)
  production-environment: npm registry (Linter package)
```

### 4.3 JSON Format

JSON format (.context.json) should also include the expanded role-specific sections. Note that JSON doesn't support kebab-case for key names, so we'll use camelCase as it's a common convention in JSON.

Example:

```json
{
  "moduleName": "Codebase Context Specification",
  "version": "1.0.0",
  "description": "A specification for providing explicit context information about a codebase",
  "relatedModules": [
    {
      "name": "Context Editor",
      "path": "./examples/context-editor"
    },
    {
      "name": "TypeScript Linter",
      "path": "https://github.com/Agentic-Insights/codebase-context-spec/tree/main/linters/typescript"
    }
  ],
  "mainTechnologies": [
    "Markdown",
    "YAML",
    "JSON",
    "TypeScript"
  ],
  "conventions": [
    "Follow Markdown best practices",
    "Use YAML for structured data",
    "Consistent naming conventions",
    "Use lowercase and underscores for all .ts files"
  ],
  "architecture": {
    "style": "Documentation-driven",
    "mainComponents": [
      "Specification document",
      "Context Editor",
      "TypeScript Linter"
    ],
    "dataFlow": [
      "Codebase -> .context.md files -> Linter -> Validation results"
    ]
  },
  "development": {
    "setupSteps": [
      "Clone the repository",
      "Review the specification documents",
      "Install linter dependencies"
    ],
    "buildCommand": "npm run build",
    "testCommand": "npm test"
  },
  "businessRequirements": {
    "keyFeatures": [
      "Provide a standardized format for codebase context",
      "Enable AI-assisted development with explicit context",
      "Support multiple programming languages and frameworks"
    ],
    "targetAudience": "Developers and AI assistants",
    "successMetrics": [
      "Adoption rate among developers",
      "Improved AI-assisted development accuracy"
    ]
  },
  "qualityAssurance": {
    "testingFrameworks": [
      "Jest",
      "Pytest"
    ],
    "coverageThreshold": "90%",
    "performanceBenchmarks": [
      "Linting speed for large codebases",
      "Memory usage during linting"
    ]
  },
  "deployment": {
    "platform": "GitHub",
    "cicdPipeline": "GitHub Actions",
    "stagingEnvironment": "GitHub Pages (Documentation)",
    "productionEnvironment": "npm registry (Linter package)"
  }
}
```

## 5. Context Accumulation and Usage

1. Context accumulates as you traverse deeper into the directory structure.
2. More specific contexts provide additional detail to broader contexts.
3. AI models should consider all relevant context files, prioritizing more specific contexts when appropriate.
4. There is no strict overriding; AI judges context relevance based on the query or task.
5. `.context.md` files can be placed anywhere in the codebase, but having one at the root that references others is highly recommended.
6. The root `.context.md` file should provide an overview of the project and reference other important context files throughout the codebase.

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

**Warning:** Tooling may be required for proper implementation of `.contextignore`. AI agents may not consistently or easily use `.contextignore` as strictly as dedicated tooling can. Your mileage may vary (YMMV) depending on the AI model used.

## 7. The .contextdocs File

The `.contextdocs` file allows developers to specify external documentation sources that should be incorporated into the project's context. This feature is particularly useful for including documentation from dependencies, libraries, or related projects.

### 7.1 Location and Naming

- The `.contextdocs` file should be placed in the root directory of the project.
- It must use one of the following extensions:
  - `.contextdocs.md` (default, recommended)
  - `.contextdocs.yaml` or `.contextdocs.yml`
  - `.contextdocs.json`

### 7.2 File Structure

The `.contextdocs` file should contain an array of documentation sources. Each source can be:

- A file path relative to the project root
- A URL to a markdown file
- A package name with associated documentation files

### 7.3 Examples

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

### 7.4 Behavior

- When an AI model or related tool is processing the project context, it should fetch and incorporate the specified documentation.
- For local files, the content should be read from the specified path.
- For URLs, the content should be fetched from the provided URL.
- For packages, the documentation should be fetched from the package's repository or documentation site, based on the package name and version.

**Warning:** Tooling may be required for proper implementation of `.contextdocs`. AI agents may not consistently or easily use `.contextdocs` as strictly as dedicated tooling can. Your mileage may vary (YMMV) depending on the AI model used.

### 7.5 Use Cases

- Including documentation for key dependencies
- Referencing company-wide coding standards or guidelines
- Incorporating design documents or architectural overviews
- Linking to relevant external resources or tutorials

### 7.6 Considerations

- Ensure that URLs point to stable, version-controlled documentation to maintain consistency.
- Be mindful of the total volume of documentation to avoid overwhelming the AI model with irrelevant information.
- Regularly review and update the `.contextdocs` file to ensure all referenced documentation remains relevant and up-to-date.
- Consider implementing caching mechanisms for external documentation to improve performance and reduce network requests.

## 8. Conclusion

The Codebase Context Specification provides a flexible, standardized approach to enriching codebases with contextual information for AI models. By adopting this convention and including role-specific information, development teams can enhance AI-assisted workflows, improving code quality and development efficiency across projects of any scale or complexity. The addition of role-specific guidelines and consistent naming conventions ensures that AI models have access to comprehensive, relevant, and well-structured information tailored to different aspects of the software development lifecycle.

## 9. TypeScript Linter Implementation

For details on the TypeScript implementation of the linter for validating Codebase Context Specification files, please refer to the [TypeScript Linter README](linters/typescript/README.md).
