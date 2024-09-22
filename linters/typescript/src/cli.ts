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

function printUsage() {
  console.log(`
Usage: codebase-context-lint <directory_to_lint> [options]

Codebase Context Linter
This tool validates context files (.context.md, .context.yaml, .context.json),
.contextdocs.md, and .contextignore according to the Codebase Context Specification.

Arguments:
  <directory_to_lint>  The directory containing the files to lint

Options:
  --log-level <level>  Set the logging level (error, warn, info, debug)
                       Default: info
  --help, -h           Show this help message

Examples:
  codebase-context-lint .
  codebase-context-lint /path/to/project --log-level debug

For more information, visit: https://github.com/Agentic-Insights/codebase-context-spec
`);
}

async function main() {
  const args = process.argv.slice(2);
  let directoryToLint: string | undefined;
  let logLevel = LogLevel.INFO;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--log-level':
        if (i + 1 < args.length) {
          logLevel = parseLogLevel(args[++i]);
        } else {
          console.error('Error: --log-level requires a value');
          process.exit(1);
        }
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
      default:
        if (!directoryToLint) {
          directoryToLint = args[i];
        } else {
          console.error(`Error: Unexpected argument '${args[i]}'`);
          printUsage();
          process.exit(1);
        }
    }
  }

  if (!directoryToLint) {
    console.error('Error: Directory to lint is required');
    printUsage();
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