# 🧠💻 Codebase Context Lint

<div align="center">
  <img src="https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png" alt="Codebase Context Lint Logo" width="500">
</div>

<h3 align="center">Codebase Context Lint</h3>

<p align="center">
  CLI linter for Codebase Context Specification (CCS) files
  <br>
  <a href="https://github.com/Agentic-Insights/codebase-context-spec"><strong>Explore the spec »</strong></a>
  <br>
  <br>
  <a href="https://github.com/Agentic-Insights/codebase-context-spec/issues/new?template=bug_report.md">Report bug</a>
  ·
  <a href="https://github.com/Agentic-Insights/codebase-context-spec/issues/new?template=feature_request.md">Request feature</a>
</p>

## 🔎 Overview

This is a CLI linter for validating Codebase Context Specification (CCS) files, including `.context.md`, `.context.yaml`, `.context.json`, `.contextdocs.md`, and `.contextignore` files. The Codebase Context Specification is a convention for documenting your code to enhance understanding for both AI and human developers.

## 📚 What is Codebase Context?

Codebase Context is a convention similar to `.env` and `.editorconfig` systems, but focused on documenting your code for both AI and humans. Just as `.env` files manage environment variables and `.editorconfig` ensures consistent coding styles, CCS files provide a standardized way to capture and communicate the context of your codebase.

This convention allows developers to:
1. Document high-level architecture and design decisions
2. Explain project-specific conventions and patterns
3. Highlight important relationships between different parts of the codebase
4. Provide context that might not be immediately apparent from the code itself

By adopting this convention, teams can ensure that both human developers and AI assistants have access to crucial contextual information, leading to better code understanding, more accurate suggestions, and improved overall development efficiency.

For more detailed information about the Codebase Context Specification, please refer to the [main repository](https://github.com/Agentic-Insights/codebase-context-spec) and the [full specification](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODEBASE-CONTEXT.md).

## 📦 Installation

You can install the linter globally using npm:

```
npm install -g codebase-context-lint
```

## 🚀 Usage

After installation, you can use the linter from the command line:

```
codebase-context-lint <directory_to_lint>
```

Replace `<directory_to_lint>` with the path to the directory containing your Codebase Context Specification files.

## ✨ Features

- 🔍 Validates the structure and content of `.context.md`, `.context.yaml`, and `.context.json` files
- ✅ Checks for required fields and sections
- 📄 Verifies the format of `.contextdocs.md` files
- 🚫 Validates ignore patterns in `.contextignore` files
- 💬 Provides detailed error messages and warnings

## 🤖 Using with AI Assistants

While this linter provides automated validation of CCS files, you can also use the Codebase Context Specification with AI assistants without any specific tooling. The [CODING-ASSISTANT-PROMPT.md](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODING-ASSISTANT-PROMPT.md) file in the main repository provides guidelines for AI assistants to understand and use the Codebase Context Specification.

To use the Codebase Context Specification with an AI assistant:

1. Include the content of CODING-ASSISTANT-PROMPT.md in your prompt to the AI assistant.
2. Ask the AI to analyze your project's context files based on these guidelines.
3. The AI will be able to provide more accurate and context-aware responses by following the instructions in the prompt.

Note that while this approach allows for immediate use of the specification, some features like .contextignore should eventually be applied by tooling (such as this linter) for more robust implementation.

## 🛠️ Development

To contribute to this project:

1. Clone the repository:
   ```
   git clone https://github.com/Agentic-Insights/codebase-context-spec.git
   cd codebase-context-spec/linters/typescript
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. To test the CLI locally, you can use:
   ```
   npm link
   ```
   This will create a symlink to your local development version of the package.

5. Create your feature branch (`git checkout -b feature/AmazingFeature`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## � Learn More

For a deeper dive into the Codebase Context Specification, check out this [SubStack article by Vaskin](https://agenticinsights.substack.com/p/codebase-context-specification-rfc), the author of the specification.

## �📄 License

This project is licensed under the MIT License.

## 🔗 Related Links

- [Codebase Context Specification Repository](https://github.com/Agentic-Insights/codebase-context-spec)
- [Full Specification (CODEBASE-CONTEXT.md)](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODEBASE-CONTEXT.md)
- [NPM Package (codebase-context-lint)](https://www.npmjs.com/package/codebase-context-lint)
- [AI Assistant Prompt (CODING-ASSISTANT-PROMPT.md)](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODING-ASSISTANT-PROMPT.md)