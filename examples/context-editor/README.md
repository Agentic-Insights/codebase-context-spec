# Codebase Context Editor

The Codebase Context Editor is a web-based tool designed to help developers create and manage `.context.md`, `.contextdocs.md`, and `.contextignore` files for their projects. These files are part of the [Codebase Context Specification](https://github.com/Agentic-Insights/codebase-context-spec), which aims to enhance AI-assisted development by providing explicit context information about a codebase.

## Features

- Create and edit `.context.md` files with structured metadata and free-form Markdown content
- Generate `.contextdocs.md` files to specify external documentation sources
- Create `.contextignore` files to exclude specific files or directories from context consideration
- Preview generated files before saving
- User-friendly interface with tabbed navigation for different file types

## Technologies Used

- React 18.3.1
- TypeScript 4.9.5
- Material-UI (MUI) 6.0.2
- Emotion for styled components
- React Scripts 5.0.1

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Agentic-Insights/codebase-context-spec.git
   ```

2. Navigate to the context-editor directory:
   ```
   cd codebase-context-spec/examples/context-editor
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:

```
npm start
```

The application will be available at `http://localhost:13000`.

### Building for Production

To create a production build:

```
npm run build
```

The built files will be available in the `build` directory.

## Deploying to Cloudflare Pages

The Codebase Context Editor can be easily deployed to Cloudflare Pages. Follow these steps:

1. Fork the repository or push your changes to your GitHub account.

2. Log in to your Cloudflare account and go to the Pages section.

3. Click on "Create a project" and select your repository.

4. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `examples/context-editor`

5. Click on "Save and Deploy".

Cloudflare Pages will automatically deploy your site and provide you with a URL. It will also automatically redeploy when you push changes to your repository.

## Usage

1. Open the application in your web browser.
2. Choose the type of file you want to create or edit (`.context.md`, `.contextdocs.md`, or `.contextignore`) using the tabs at the top of the page.
3. Fill in the required information in the form.
4. Click the "Generate" button to preview the file content.
5. Review the generated content in the preview modal.
6. Copy the generated content and save it to the appropriate file in your project.

## Contributing

Contributions to the Codebase Context Editor are welcome! Please refer to the main repository's contributing guidelines for more information on how to get involved.

## License

This project is part of the Codebase Context Specification and is licensed under the terms specified in the main repository.

## Additional Resources

- [Codebase Context Specification Repository](https://github.com/Agentic-Insights/codebase-context-spec)
- [Documentation on .context.md files](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODEBASE-CONTEXT.md)
- [Documentation on .contextdocs.md files](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODEBASE-CONTEXT.md#contextdocsmd)
- [Documentation on .contextignore files](https://github.com/Agentic-Insights/codebase-context-spec/blob/main/CODEBASE-CONTEXT.md#contextignore)

For any questions or issues, please open an issue in the main Codebase Context Specification repository.
