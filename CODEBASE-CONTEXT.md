# Codebase Context Specification (CCS)

## Document Information
- **Version:** 1.1-RFC
- **Date:** 2024-12-06
- **Status:** Draft

## Overview

The Codebase Context Specification (CCS) establishes a standardized framework for documenting and communicating codebase context to both human developers and artificial intelligence systems. Through a structured directory approach, CCS enables teams to maintain comprehensive project documentation that enhances collaboration between developers and AI tools.

## 1. Core Structure

The specification defines a `.context` directory as the central location for all contextual information about a project. This directory must be present at the root of the project and may exist at the root of any significant submodule or component.

A standard `.context` directory contains:

```
.context/
├── index.md           # Primary context file with project overview
├── docs.md           # Detailed documentation
└── diagrams/         # Visual documentation in Mermaid format
    ├── architecture.mmd
    └── data-flow.mmd
```

## 2. Context Files

### 2.1 index.md Structure

The index.md file serves as the primary entry point for context information. It must include YAML front matter with the following structure:

```yaml
---
module-name: "Project Name"
description: "Comprehensive project description"
related-modules:
  - name: Simple example project root
    path: ./examples/simple
  - name: CLI tool (dotcontext)
    path: https://github.com/Agentic-Insights/dotcontext
architecture:
  style: "Architecture style"
  components:
    - name: "Component Name"
      description: "Component description"
  patterns:
    - name: "Pattern Name"
      usage: "Pattern usage description"
---
```

The remainder of index.md should provide a clear narrative overview of the project, its architecture, and key implementation details. 

To better understand the specification and its implementation, please refer to the example repositories showcasing the CCS in action.

### 2.2 docs.md Purpose

The docs.md file contains detailed documentation about specific aspects of the project, including:

1. Development guidelines and best practices
2. Business domain information
3. Technical implementation details
4. Integration patterns
5. Troubleshooting guides

## 3. AI Tool Integration

The specification is designed for straightforward integration with AI development tools. Tool developers can implement support through one of two approaches:

### 3.1 Simple Integration

For basic integration, tools can add the following instruction to their prompt or context:

"Before starting a task, if a .context directory exists, read it for an architectural overview and project context starting at .context/index.md"

This approach enables immediate compatibility without requiring complex tooling changes.

### 3.2 Advanced Integration

For more sophisticated integration, tools should:

1. Parse the YAML front matter for structured data
2. Process Mermaid diagrams for visual understanding
3. Index documentation content for contextual awareness
4. Track context hierarchy through project structure

## 4. Context Hierarchy

Context information follows a hierarchical structure through the project:

1. Root level: Project-wide architecture and standards
2. Module level: Component-specific implementations
3. Feature level: Detailed implementation context

Each level inherits context from its parent while adding its own specific information.

## 5. Best Practices

### Documentation Quality

The effectiveness of the specification relies on maintaining high-quality documentation:

1. Keep language clear and precise
2. Update documentation alongside code changes
3. Include relevant examples and explanations
4. Maintain consistency in terminology
5. Regular review and validation of context information

### Content Organization

Organize content to maximize clarity and accessibility:

1. Use clear section headings
2. Maintain logical information grouping
3. Include visual diagrams for complex concepts
4. Cross-reference related documentation
5. Keep individual files focused and concise

## 6. Implementation Guide

To implement the specification in a project:

1. Create the `.context` directory at the project root
2. Initialize index.md with required metadata
3. Document key architectural decisions
4. Add relevant diagrams in Mermaid format
5. Establish documentation update processes
6. Configure development tools for context awareness

## 7. Security Considerations

Protect sensitive information while maintaining useful context:

1. Never include credentials or secrets
2. Avoid detailed security implementation details
3. Use appropriate access controls
4. Regular security review of context content

## 8. Version Control

Maintain context documentation effectively:

1. Include .context directory in version control
2. Review context changes during code review
3. Update context files atomically with related code changes
4. Maintain change history for context evolution

## Appendix A: Migration

For projects using version 1.0 of the specification:

1. Create the `.context` directory
2. Move content from .context.md to .context/index.md
3. Restructure documentation into appropriate files
4. Update any tool configurations
5. Remove deprecated .context.md files
