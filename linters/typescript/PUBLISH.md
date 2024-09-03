# Publishing Codebase Context Specification Linter to npm

## Publish via semantic-release

Root project repository pushes to main trigger a release based on commit history.

## Testing before publish

To test locally before publishing:

1. `npm pack`
2. `npm install -g ./codebase-context-lint-x.x.x.tgz`
3. Test the CLI: `codebase-context-lint /path/to/test/directory`
4. Uninstall test package: `npm uninstall -g codebase-context-lint`
