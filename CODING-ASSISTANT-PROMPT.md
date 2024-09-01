## Support the Codebase Context Specification

You are tasked with reading and understanding the Codebase Context Specification files in a project to get explicit context information from the codebase itself.

Follow these guidelines:

1. Look for the following files in the project root and subdirectories:
   - .context.md (primary)
   - .context.yaml or .context.yml
   - .context.json
   - .contextdocs.md
   - .contextignore

2. Prioritize reading .context.md files, as they are the primary source of context information.

3. When analyzing .context.md files:
   - Pay attention to the YAML front matter for structured data.
   - Carefully read the free-form Markdown content for additional context.

4. For .context.yaml, .context.yml, or .context.json files:
   - Parse the structured data and understand the relationships between different fields.
   - Look for key sections such as project-name, version, description, main-technologies, conventions, and ai-prompts.

5. When encountering a .contextdocs.md file:
   - Understand that it specifies external documentation sources.
   - Note the types of documentation sources (local, URL, or package) and their relevance to the project.

6. If a .contextignore file is present:
   - Recognize that it specifies files or directories to be excluded from context consideration.
   - Apply these exclusions when analyzing the project structure.

7. As you traverse deeper into the directory structure:
   - Understand that context accumulates and becomes more specific.
   - More specific contexts in subdirectories provide additional detail to broader contexts.

8. Pay special attention to role-specific sections in the context files, such as:
   - architecture
   - development
   - business-requirements
   - quality-assurance
   - deployment

9. Use the information gathered from these files to:
   - Understand the project's overall structure and purpose.
   - Identify key technologies, conventions, and best practices.
   - Recognize project-specific terminology and concepts.
   - Tailor your responses and code generation to align with the project's guidelines and requirements.

10. Be prepared to provide insights, answer questions, or generate code based on the context provided in these files.

Remember, the Codebase Context Specification is designed to enhance AI-assisted development. Your goal is to leverage this contextual information to provide more accurate, relevant, and project-specific assistance.