# 🧠💻 Codebase Context Lint

<div align="center">
  <img src="https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png" alt="Codebase Context Lint Logo" width="500">
</div>

<h3 align="center">Codebase Context Lint</h3>

<p align="center">
  CLI linter for AI Context Convention files
  <br>
  <a href="https://github.com/Agentic-Insights/codebase-context-spec"><strong>Explore the spec »</strong></a>
  <br>
  <br>
  <a href="https://github.com/Agentic-Insights/codebase-context-spec/issues/new?template=bug_report.md">Report bug</a>
  ·
  <a href="https://github.com/Agentic-Insights/codebase-context-spec/issues/new?template=feature_request.md">Request feature</a>
</p>

## 🔎 Overview

This is a CLI linter for validating AI Context Convention files, including `.context.md`, `.context.yaml`, `.context.json`, `.contextdocs.md`, and `.contextignore` files.

## 📦 Installation

You can install the linter globally using npm:

```
npm install -g codebase-context-lint
```

## 🚀 Usage

After installation, you can use the linter from the command line:

```
ai-context-lint <directory_to_lint>
```

Replace `<directory_to_lint>` with the path to the directory containing your AI Context Convention files.

## ✨ Features

- 🔍 Validates the structure and content of `.context.md`, `.context.yaml`, and `.context.json` files
- ✅ Checks for required fields and sections
- 📄 Verifies the format of `.contextdocs.md` files
- 🚫 Validates ignore patterns in `.contextignore` files
- 💬 Provides detailed error messages and warnings

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

## 📄 License

This project is licensed under the MIT License.