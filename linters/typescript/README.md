# AI Context Convention TypeScript Linter

This is a TypeScript implementation of the linter for validating AI Context Convention files.

## Installation

1. Ensure you have Node.js (v14+) and npm installed.
2. Clone the entire repository:
   ```
   git clone https://github.com/your-repo/ai-context-convention.git
   ```
3. Navigate to the `linters/typescript` directory:
   ```
   cd ai-context-convention/linters/typescript
   ```
4. Run `npm install` to install the dependencies.

## Usage

To use the TypeScript linter:

1. Build the TypeScript code:
   ```
   npm run build
   ```

2. Run the linter on a directory:
   ```
   npm run lint <directory_to_lint>
   ```

   Replace `<directory_to_lint>` with the path to the directory containing the context files you want to lint.

   Note: You can use relative paths. For example, to lint the parent directory:
   ```
   npm run lint ../..
   ```

## Example Output

When you run the linter, you'll see output similar to this:

```
========================================================
AI Context Convention TypeScript Linter (v1.0.0)
========================================================

Linting directory: ../..

Linting file: .context.md
  - Validating Markdown structure
  - Checking YAML frontmatter
  - Verifying content against AI Context Convention Specification

Linting completed.
```

## Features

The TypeScript linter performs the following checks:

- Identifies and processes .context.md, .context.yaml, and .context.json files
- Validates the structure of context files
- Ensures required fields are present
- Checks for proper YAML frontmatter in Markdown files
- Verifies the content adheres to the AI Context Convention Specification

## Development

To contribute to the development of this linter:

1. Make your changes in the `typescript_linter.ts` file.
2. Build the TypeScript code:
   ```
   npm run build
   ```
3. Test your changes by running the linter on sample files.

Note: The `dist` directory, which contains the compiled JavaScript files, is ignored by git. Make sure to rebuild the project after making changes.

## Contributing

When working on the TypeScript linter:

1. Follow TypeScript best practices and coding conventions.
2. Use strict mode and appropriate type annotations.
3. Write unit tests for new functionality.
4. Keep the linter consistent with other language implementations.
5. Update comments and documentation as necessary.

Refer to the main README.md in the project root for the full AI Context Convention Specification and contribution guidelines.

## Troubleshooting

If you encounter any issues:

1. Ensure you've run `npm install` to install all dependencies.
2. Make sure you've built the project using `npm run build` before running the linter.
3. Check that you're in the correct directory (`linters/typescript`) when running npm commands.
4. If you see "unknown" as the version number, it means the linter couldn't read the package.json file. This doesn't affect functionality but you may want to check file permissions.

## License

This project is licensed under the ISC License.

## Future Enhancements

- Integration with VSCode extension for in-editor linting
- More detailed error reporting and suggestions for fixing issues
- Configuration options for customizing linting rules
- Support for custom file extensions and naming conventions