#!/usr/bin/env node

import { ContextLinter, LogLevel } from './context_linter';
import { getPackageVersion } from './utils';

function parseLogLevel(logLevelArg: string): LogLevel {
  switch (logLevelArg.toLowerCase()) {
    case 'error':
      return LogLevel.ERROR;
    case 'warn':
      return LogLevel.WARN;
    case 'info':
      return LogLevel.INFO;
    case 'debug':
      return LogLevel.DEBUG;
    default:
      console.warn(`Invalid log level: ${logLevelArg}. Using default (INFO).`);
      return LogLevel.INFO;
  }
}

async function main() {
  const args = process.argv.slice(2);
  let directoryToLint: string | undefined;
  let logLevel = LogLevel.INFO;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--log-level' && i + 1 < args.length) {
      logLevel = parseLogLevel(args[i + 1]);
      i++; // Skip the next argument as it's the log level value
    } else if (!directoryToLint) {
      directoryToLint = args[i];
    }
  }

  if (!directoryToLint) {
    console.error(`
Usage: codebase-context-lint <directory_to_lint> [--log-level <level>]

Codebase Context Linter
This tool validates context files, including .contextdocs.md and .contextignore, according to the Codebase Context Specification.

Options:
  --log-level <level>  Set the logging level (error, warn, info, debug). Default: info
`);
    process.exit(1);
  }

  const packageVersion = await getPackageVersion();
  const linter = new ContextLinter(logLevel);
  const isValid = await linter.lintDirectory(directoryToLint, packageVersion);

  process.exit(isValid ? 0 : 1);
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});