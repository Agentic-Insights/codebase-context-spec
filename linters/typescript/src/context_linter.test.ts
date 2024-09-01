import { ContextLinter } from './context_linter';

jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

describe('ContextLinter', () => {
  let linter: ContextLinter;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    linter = new ContextLinter();
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe('lintDirectory', () => {
    it('should lint all context files in a directory', async () => {
      const mockFiles = ['.context.md', 'file.context.yaml', 'another.context.json'];
      (require('fs/promises').readdir as jest.Mock).mockResolvedValue(mockFiles);
      (require('fs/promises').readFile as jest.Mock).mockResolvedValue('mock content');

      await linter.lintDirectory('/mock/path', '1.0.0');

      expect(require('fs/promises').readdir).toHaveBeenCalledWith('/mock/path');
      expect(require('fs/promises').readFile).toHaveBeenCalledTimes(5); // 3 context files + .contextdocs.md + .contextignore
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Linting completed.'));
    });

    it('should handle empty directories', async () => {
      (require('fs/promises').readdir as jest.Mock).mockResolvedValue([]);

      await linter.lintDirectory('/mock/path', '1.0.0');

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('No context files found'));
    });
  });

  describe('lintFile', () => {
    it('should lint markdown files correctly', async () => {
      const validMarkdown = `---
project-name: Test Project
version: 1.0.0
description: A test project
main-technologies: [TypeScript, Jest]
---

# Title

## Architecture Overview

Content here.

## Development Guidelines

More content.
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(validMarkdown);

      await (linter as any).lintFile('test.context.md');

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should report errors for invalid markdown files', async () => {
      const invalidMarkdown = `---
project-name: Test Project
---

Content without proper structure.
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(invalidMarkdown);

      await (linter as any).lintFile('test.context.md');

      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Missing required field'));
    });

    it('should lint YAML files correctly', async () => {
      const validYaml = `
project-name: Test Project
version: 1.0.0
description: A test project
main-technologies:
  - TypeScript
  - Jest
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(validYaml);

      await (linter as any).lintFile('test.context.yaml');

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should report errors for invalid YAML files', async () => {
      const invalidYaml = `
project-name: Test Project
version: 1.0.0
description: A test project
main-technologies: TypeScript, Jest
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(invalidYaml);

      await (linter as any).lintFile('test.context.yaml');

      expect(mockConsoleWarn).toHaveBeenCalled();
    });

    it('should lint JSON files correctly', async () => {
      const validJson = JSON.stringify({
        projectName: 'Test Project',
        version: '1.0.0',
        description: 'A test project',
        mainTechnologies: ['TypeScript', 'Jest']
      });

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(validJson);

      await (linter as any).lintFile('test.context.json');

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should report errors for invalid JSON files', async () => {
      const invalidJson = `{
        "projectName": "Test Project",
        "version": "1.0.0",
        "description": "A test project",
        "mainTechnologies": "TypeScript, Jest"
      }`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(invalidJson);

      await (linter as any).lintFile('test.context.json');

      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Invalid field'));
    });
  });

  describe('lintFileIfExists', () => {
    it('should lint .contextdocs.md file correctly', async () => {
      const validContextdocs = `# AI Context Documentation

## Overview

Content here.

## File Structure

Content here.

## Conventions

Content here.
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(validContextdocs);

      await (linter as any).lintFileIfExists('/mock/path/.contextdocs.md', (linter as any).lintContextdocsFile.bind(linter));

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should report errors for invalid .contextdocs.md file', async () => {
      const invalidContextdocs = `# Wrong Title

## Missing Sections

Content here.
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(invalidContextdocs);

      await (linter as any).lintFileIfExists('/mock/path/.contextdocs.md', (linter as any).lintContextdocsFile.bind(linter));

      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should lint .contextignore file correctly', async () => {
      const validContextignore = `
# Comment
*.log
/build
/dist
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(validContextignore);

      await (linter as any).lintFileIfExists('/mock/path/.contextignore', (linter as any).lintContextignoreFile.bind(linter));

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should report errors for invalid .contextignore file', async () => {
      const invalidContextignore = `
*.log
/build
.context.md
`;

      (require('fs/promises').readFile as jest.Mock).mockResolvedValue(invalidContextignore);

      await (linter as any).lintFileIfExists('/mock/path/.contextignore', (linter as any).lintContextignoreFile.bind(linter));

      expect(mockConsoleError).toHaveBeenCalled();
    });
  });
});