---
projectName: Codebase Context Specification
description: A specification and tools for embedding rich contextual information within codebases to enhance AI-assisted development
version: 1.0-preview
mainTechnologies:
  - Markdown
  - YAML
  - JSON
  - TypeScript
conventions:
  - Use .context.md files for structured (frontmatter) and general context
  - Use .context.yaml or .context.json for structured data when needed
  - Follow the Codebase Context Specification
  - Implement linters for various programming languages
---

# Codebase Context Specification

This project defines and implements the Codebase Context Specification, a standardized approach to providing context for AI-assisted development. The specification aims to enhance the effectiveness of AI models in understanding and working with codebases.

## Project Structure

- Root directory: Contains specification files, main documentation, and linter subdirectories
- `linters/`: Contains language-specific linter implementations
  - `typescript/`: TypeScript linter implementation
  - `python/`: Python linter implementation (placeholder)

## Key Components

1. Specification: Defined in CODEBASE-CONTEXT.md
2. Linter Implementations:
   - TypeScript: `linters/typescript/src/context_linter.ts`
   - Python: (To be implemented)
3. Documentation:
   - Main README: README.md
   - Linter-specific README: `linters/typescript/README.md`

## Development Guidelines

- Follow the specification outlined in CODEBASE-CONTEXT.md
- Ensure all new features have corresponding tests
- Keep the linter implementations for different languages consistent in functionality
- Update examples and documentation when making significant changes to the specification

## Getting Started

Refer to the main README.md file for an overview of the project and its components. For language-specific linter setup and usage, see the README files in the respective linter directories.

## Contributing

We welcome contributions! Please see the main README.md file for guidelines on how to contribute to this project. When contributing to specific linters, refer to their individual documentation for language-specific contribution guidelines.