# Publishing AI Context Convention Linter to npm

Quick developer instructions for publishing:

1. Ensure you're in the `linters/typescript` directory.
2. Build the project: `npm run build`
3. Update version: `npm version patch|minor|major`
4. Publish: `npm publish`

## Testing before publish

To test locally before publishing:

1. `npm pack`
2. `npm install -g ./ai-context-convention-linter-x.x.x.tgz`
3. Test the CLI: `ai-context-lint /path/to/test/directory`
4. Uninstall test package: `npm uninstall -g ai-context-convention-linter`

TODO: Implement automated publishing using semantic versioning and GitHub Actions.