---
module-name: "codebase-context-spec"
description: "Core specification for the Codebase Context standard"
version: "1.1.0-RFC"
technologies:
  - "Markdown"
related-modules:
  - name: "@codebase-context/cc-cli"
    description: "Official CLI tool for working with CCS"
    repository: "https://www.npmjs.com/package/@codebase-context/cc-cli"
status: "active"
---

# Codebase Context Specification Repository

This repository contains the core specification for the Codebase Context standard. It is intentionally minimal, serving primarily as the canonical reference for the CCS format and implementation guidelines.

## Repository Structure

The repository consists of:
- `CODEBASE-CONTEXT.md`: The main specification document
- `README.md`: Project overview and documentation
- `img/`: Supporting diagrams and visual assets

## Related Tools

The primary implementation tool for this specification is the `@codebase-context/cc-cli` package, which provides command-line utilities for:
- Creating and managing .context directories
- Validating context files against the specification
- Generating context documentation

For implementation details and usage, visit the [cc-cli package on NPM](https://www.npmjs.com/package/@codebase-context/cc-cli).
