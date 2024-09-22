# Codebase Context Specification (CCS) v 1.0.0-RFC

[![npm version](https://img.shields.io/npm/v/codebase-context-lint.svg)](https://www.npmjs.com/package/codebase-context-lint)

![Codebase Context Image](./img/codebase-context.png "Codebase Context Specification")

## Introduction

Welcome to the [Codebase Context Specification (CCS)](./CODEBASE-CONTEXT.md) repository! This project establishes a standardized method for embedding rich contextual information within codebases to enhance understanding for both AI and human developers. By providing a clear and consistent way to communicate project structure, conventions, and key concepts, we significantly improve code comprehension and facilitate more effective collaboration between humans and AI in software development.

## Quick Links

- [Full Specification (CODEBASE-CONTEXT.md)](./CODEBASE-CONTEXT.md)
- [GitHub Repository](https://github.com/Agentic-Insights/codebase-context-spec)
- [NPM Package (codebase-context-lint)](https://www.npmjs.com/package/codebase-context-lint)
- [SubStack Article by Vaskin](https://agenticinsights.substack.com/p/codebase-context-specification-rfc)
- [Context File Example (.context.md)](.context.md)
- [AI Assistant Prompt (CODING-ASSISTANT-PROMPT.md)](CODING-ASSISTANT-PROMPT.md)

## Installation

To install the Codebase Context Linter globally, use npm:

```bash
npm install -g codebase-context-lint
```

## CLI Usage

After global installation, you can use the `codebase-context-lint` command to lint your project:

```bash
codebase-context-lint [directory_to_lint] [options]
```

You can also use npx to run the linter without installing it globally:

```bash
npx codebase-context-lint [directory_to_lint] [options]
```

If no directory is specified, the linter will default to the current directory.

Options:
- `--log-level <level>`: Set the logging level (error, warn, info, debug). Default: info
- `--help`, `-h`: Show the help message

Examples:
```bash
codebase-context-lint
codebase-context-lint .
codebase-context-lint /path/to/project --log-level debug
npx codebase-context-lint
npx codebase-context-lint /path/to/project --log-level debug
```

The linter will validate your .context.md, .context.yaml, .context.json, .contextdocs.md, and .contextignore files according to the Codebase Context Specification.

## Library Usage

You can also use the Codebase Context Linter as a library in your TypeScript or JavaScript projects:

```typescript
import { ContextLinter, LogLevel } from 'codebase-context-lint';

const linter = new ContextLinter(LogLevel.INFO);
const isValid = await linter.lintDirectory('/path/to/your/project', '1.0.0');

console.log(`Linting result: ${isValid ? 'Valid' : 'Invalid'}`);
```

Note: The linter will automatically create any necessary directories when writing files.

## Codebase Context Editor

To help you get started with creating context files for your project, we've developed the Codebase Context Editor. This tool simplifies the process of generating .context.md, .contextdocs.md, and .contextignore files that adhere to the Codebase Context Specification.

[**Get Started with the Codebase Context Editor**](https://agentic-insights.github.io/codebase-context-spec/)

The Codebase Context Editor provides an intuitive interface for:
- Creating and editing context files
- Viewing and copying AI prompts for context generation
- Validating your context files against the specification

Whether you're new to the Codebase Context Specification or an experienced user, the editor can significantly streamline your workflow.

## Supported Node.js Versions

This project supports the following Node.js versions:

- Node.js 18.x
- Node.js 20.x
- Node.js 22.x

We recommend using the latest LTS (Long Term Support) version of Node.js for optimal performance and security.

## Codebase Context: A New Convention

The Codebase Context Specification introduces a convention similar to `.env` and `.editorconfig` systems, but focused on documenting your code for both AI and humans. Just as `.env` files manage environment variables and `.editorconfig` ensures consistent coding styles, CCS files (`.context.md`, `.context.yaml`, `.context.json`) provide a standardized way to capture and communicate the context of your codebase.

This convention allows developers to:
1. Document high-level architecture and design decisions
2. Explain project-specific conventions and patterns
3. Highlight important relationships between different parts of the codebase
4. Provide context that might not be immediately apparent from the code itself

By adopting this convention, teams can ensure that both human developers and AI assistants have access to crucial contextual information, leading to better code understanding, more accurate suggestions, and improved overall development efficiency.

## Key Concepts

- **Contextual Metadata**: Structured information about the project, its components, and conventions, designed for both human and AI consumption.
- **AI-Human Collaborative Documentation**: Guidelines for creating documentation that's easily parsed by AI models while remaining human-readable and maintainable.
- **Standardized Context Files**: Consistent use of `.context.md`, `.context.yaml`, and `.context.json` files for conveying codebase context at various levels (project-wide, directory-specific, etc.).
- **Context-Aware Development**: Encouraging a development approach that considers and documents the broader context of code, not just its immediate functionality.

## Recent Updates

We've recently updated our dependencies to address security vulnerabilities and improve compatibility with different Node.js versions. If you encounter any issues after updating, please report them in our GitHub issues.

## Using with AI Assistants

The [CODING-ASSISTANT-PROMPT.md](./CODING-ASSISTANT-PROMPT.md) file provides guidelines for AI assistants to understand and use the Codebase Context Specification. This allows for immediate adoption of the specification without requiring specific tooling integration.

To use the Codebase Context Specification with an AI assistant:

1. Include the content of CODING-ASSISTANT-PROMPT.md in your prompt to the AI assistant.
2. Ask the AI to analyze your project's context files based on these guidelines.
3. The AI will be able to provide more accurate and context-aware responses by following the instructions in the prompt.

Note that while this approach allows for immediate use of the specification, some features like .contextignore should eventually be applied by tooling for more robust implementation.

## Tooling Recommendations

Developers are encouraged to create:

- Memory systems using git branches as storage
- IDE plugins for context file creation and editing
- AI model integrations for parsing and utilizing context
- Tools for aggregating and presenting project-wide context
- Agents that can help create context in codebases that are blank
- Codebase summarizers, submodule summarizers
- Memory systems that take advantage of the context
- Continuous TODO monitors that can re-try implementations / solutions

## Future Directions

1. Integration with existing documentation systems
2. Dynamic context generation through code analysis
3. Potential support for explicit context overriding
4. Agent tool / context matching and references

## Contribution / RFC Process

We welcome contributions and feedback from the community to help shape the final specification. Here's how you can get involved:

1. **Review the Specification**: Start by thoroughly reading the current specification in CODEBASE-CONTEXT.md.
2. **Open an Issue**: For suggestions, questions, or concerns, open an issue in this repository.
3. **Submit a Pull Request**: For proposed changes or additions, submit a pull request with a clear description of your modifications.
4. [**Join the Discussion**](https://github.com/Agentic-Insights/codebase-context-spec/discussions): Participate in open discussions and provide your insights on existing issues and pull requests.

All contributions will be reviewed and discussed openly. Significant changes may go through an RFC (Request for Comments) process to ensure thorough consideration and community input.

## Version History

- 1.0.0-RFC: Initial RFC release of the Codebase Context Specification

## Learn More

For a deeper dive into the Codebase Context Specification, check out this [SubStack article by Vaskin](https://agenticinsights.substack.com/p/codebase-context-specification-rfc), the author of the specification.
