#!/usr/bin/env node

import { TypeScriptLinter } from './typescript_linter';
import { getPackageVersion } from './utils';

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error(`
Usage: ai-context-lint <directory_to_lint>

AI Context Convention TypeScript Linter
This tool validates context files, including .contextdocs.md and .contextignore, according to the AI Context Convention Specification.
`);
    process.exit(1);
  }

  const directoryToLint = args[0];
  const packageVersion = await getPackageVersion();
  const linter = new TypeScriptLinter();
  await linter.lintDirectory(directoryToLint, packageVersion);
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});