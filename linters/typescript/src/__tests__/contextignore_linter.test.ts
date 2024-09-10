import { ContextignoreLinter } from '../contextignore_linter';
import * as path from 'path';

describe('ContextignoreLinter', () => {
  let linter: ContextignoreLinter;

  beforeEach(() => {
    linter = new ContextignoreLinter();
  });

  describe('lintContextignoreFile', () => {
    it('should validate a correct .contextignore file', async () => {
      const content = `
        # This is a comment
        node_modules/
        *.log
        /build
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(true);
    });

    it('should detect invalid patterns', async () => {
      const content = `
        node_modules/
        *.log
        /build
        invalid**pattern
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(false);
    });

    it('should detect attempts to ignore critical files', async () => {
      const content = `
        node_modules/
        *.log
        .context.md
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(false);
    });

    it('should detect conflicting patterns', async () => {
      const content = `
        node_modules/
        !node_modules/important/
        node_modules/important/
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(false);
    });
  });

  describe('isIgnored', () => {
    beforeEach(async () => {
      const content = `
        node_modules/
        *.log
        /build
      `;
      await linter.lintContextignoreFile(content, '/project/.contextignore');
    });

    it('should correctly identify ignored files', () => {
      expect(linter.isIgnored('/project/node_modules/package/index.js', '/project')).toBe(true);
      expect(linter.isIgnored('/project/app.log', '/project')).toBe(true);
      expect(linter.isIgnored('/project/build/main.js', '/project')).toBe(true);
    });

    it('should correctly identify non-ignored files', () => {
      expect(linter.isIgnored('/project/src/index.js', '/project')).toBe(false);
      expect(linter.isIgnored('/project/README.md', '/project')).toBe(false);
    });

    it('should not ignore critical files', () => {
      expect(linter.isIgnored('/project/.context.md', '/project')).toBe(false);
      expect(linter.isIgnored('/project/subdir/.context.yaml', '/project')).toBe(false);
      expect(linter.isIgnored('/project/.contextignore', '/project')).toBe(false);
    });
  });

  describe('getIgnoredFiles', () => {
    beforeEach(async () => {
      const content = `
        *.log
        /build
      `;
      await linter.lintContextignoreFile(content, '/project/.contextignore');
    });

    it('should return a list of ignored files', () => {
      const ignoredFiles = linter.getIgnoredFiles('/project');
      expect(ignoredFiles).toContain('app.log');
      expect(ignoredFiles).toContain('build/main.js');
      expect(ignoredFiles).not.toContain('src/index.js');
    });
  });
});