# AI Context Convention Specification

Version: 1.0-preview
Date: 2024-08-31

## 1. Overview

The AI Context Convention is a standardized method for embedding rich contextual information within codebases to enhance AI-assisted development. This specification outlines a flexible, language-agnostic approach to providing both structured and unstructured context at various levels of a project.

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
├── .contexignore
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

Markdown files (.context.md) are the default and recommended format. They can include an optional YAML front matter for structured data, followed by free-form Markdown content.

Example:

```markdown
---
description: Core application logic
conventions:
  - Use camelCase for variable names
  - Each function should have a single responsibility
aiPrompts:
  - Focus on performance optimizations
  - Suggest ways to improve error handling
fileContexts:
  auth.js:
    description: Authentication module
    aiPrompts:
      - Review security measures
      - Suggest improvements for password hashing
  data.js:
    description: Data processing module
    conventions:
      - Use async/await for all database operations
---

# Core Application Logic

This directory contains the core logic for our application, including user authentication and data processing.

## Authentication Module (auth.js)

The authentication module handles user login, registration, and password reset functionality. It uses bcrypt for password hashing and JWT for session management.

Key considerations:
- OWASP security best practices
- GDPR compliance for data handling

## Data Processing Module (data.js)

The data processing module is responsible for all database interactions and data transformations. It uses an ORM for database operations and implements caching for improved performance.

Performance considerations:
- Optimize database queries
- Implement efficient data structures for in-memory operations
```

### 4.2 YAML Format

YAML format (.context.yaml or .context.yml) can be used as an alternative to Markdown for purely structured data.

Example:

```yaml
description: Core application logic
conventions:
  - Use camelCase for variable names
  - Each function should have a single responsibility
aiPrompts:
  - Focus on performance optimizations
  - Suggest ways to improve error handling
fileContexts:
  auth.js:
    description: Authentication module
    aiPrompts:
      - Review security measures
      - Suggest improvements for password hashing
  data.js:
    description: Data processing module
    conventions:
      - Use async/await for all database operations
```

### 4.3 JSON Format

JSON format (.context.json) can be used for purely structured data when preferred.

Example:

```json
{
  "description": "Core application logic",
  "conventions": [
    "Use camelCase for variable names",
    "Each function should have a single responsibility"
  ],
  "aiPrompts": [
    "Focus on performance optimizations",
    "Suggest ways to improve error handling"
  ],
  "fileContexts": {
    "auth.js": {
      "description": "Authentication module",
      "aiPrompts": [
        "Review security measures",
        "Suggest improvements for password hashing"
      ]
    },
    "data.js": {
      "description": "Data processing module",
      "conventions": [
        "Use async/await for all database operations"
      ]
    }
  }
}
```

## 5. Context Accumulation

1. Context accumulates as you traverse deeper into the directory structure.
2. More specific contexts provide additional detail to broader contexts.
3. AI models should consider all relevant context files, prioritizing more specific contexts when appropriate.
4. There is no strict overriding; AI judges context relevance based on the query or task.

## 6. The .contexignore File

The `.contexignore` file, placed in the project root, excludes files or directories from context consideration.

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
documentation:
  - type: local
    path: docs/project_overview.md
  - type: url
    url: https://raw.githubusercontent.com/example/repo/main/API.md
  - type: package
    name: express
    version: 4.17.1
    docs:
      - README.md
      - docs/api.md
      - docs/guide/routing.md
---

# Additional Documentation Notes

This section can include any free-form text to provide context about the listed documentation sources, their relevance to the project, or any other pertinent information.
```

#### YAML Format (.contextdocs.yaml)

```yaml
documentation:
  - type: local
    path: docs/project_overview.md
  - type: url
    url: https://raw.githubusercontent.com/example/repo/main/API.md
  - type: package
    name: express
    version: 4.17.1
    docs:
      - README.md
      - docs/api.md
      - docs/guide/routing.md
```

#### JSON Format (.contextdocs.json)

```json
{
  "documentation": [
    {
      "type": "local",
      "path": "docs/project_overview.md"
    },
    {
      "type": "url",
      "url": "https://raw.githubusercontent.com/example/repo/main/API.md"
    },
    {
      "type": "package",
      "name": "express",
      "version": "4.17.1",
      "docs": [
        "README.md",
        "docs/api.md",
        "docs/guide/routing.md"
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

## 9. Tooling Recommendations

Developers are encouraged to create:

1. Linters and validators for context files
2. IDE plugins for context file creation and editing
3. AI model integrations for parsing and utilizing context
4. Tools for aggregating and presenting project-wide context

## 10. Future Directions

1. Standardized query language for context interrogation
2. Integration with existing documentation systems
3. Dynamic context generation through code analysis
4. Potential support for explicit context overriding

## 11. Conclusion

The AI Context Convention provides a flexible, standardized approach to enriching codebases with contextual information for AI models. By adopting this convention, development teams can enhance AI-assisted workflows, improving code quality and development efficiency across projects of any scale or complexity. The addition of the `.contextdocs` file further enriches the available context by allowing the incorporation of external documentation, ensuring that AI models have access to comprehensive information about the project and its dependencies.

## 12. TypeScript Linter Implementation

For details on the TypeScript implementation of the linter for validating AI Context Convention files, please refer to the [TypeScript Linter README](linters/typescript/README.md).
