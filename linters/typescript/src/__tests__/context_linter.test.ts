import { ContextLinter } from '../context_linter';
import * as fs from 'fs';
import * as path from 'path';

describe('ContextLinter', () => {
  let linter: ContextLinter;
  const testDir = path.join(__dirname, 'test_context');

  beforeAll(() => {
    // Create test directory and files
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, '.contextignore'), `
      ignored.md
    `);
    fs.writeFileSync(path.join(testDir, '.context.md'), `---
module-name: test-module
description: A test module
---
# Test Module

This is a test module.
    `);
    fs.writeFileSync(path.join(testDir, 'ignored.md'), 'This file should be ignored');
    fs.writeFileSync(path.join(testDir, 'not_ignored.md'), 'This file should not be ignored');
    
    // Create a subdirectory with its own .contextignore
    const subDir = path.join(testDir, 'subdir');
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(subDir, '.contextignore'), '# Subdir ignore rules');
  });

  afterAll(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    linter = new ContextLinter();
  });

  describe('lintDirectory', () => {
    it('should lint a directory successfully', async () => {
      const result = await linter.lintDirectory(testDir, '1.0.0');
      expect(result).toBe(true);
    });

    it('should respect .contextignore rules', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await linter.lintDirectory(testDir, '1.0.0');
      
      // Check if ignored.md was listed in ignored files
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ignored.md'));
      // Check if not_ignored.md was not listed in ignored files
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('not_ignored.md'));

      consoleSpy.mockRestore();
    });
  });

  describe('handleContextFilesRecursively', () => {
    it('should process .context files in nested directories', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await linter.lintDirectory(testDir, '1.0.0');
      
      // Check if the main context was processed (which should be the .context.md file)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('main context: 100.00%'));

      consoleSpy.mockRestore();
    });
  });

  // Add more tests for other methods as needed
});