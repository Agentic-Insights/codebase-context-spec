import { ContextignoreLinter } from '../contextignore_linter';
import * as path from 'path';
import * as fs from 'fs';

describe('ContextignoreLinter', () => {
  let linter: ContextignoreLinter;
  const testDir = path.join(__dirname, 'test_contextignore');

  beforeAll(() => {
    // Create test directory and files
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, '.contextignore'), `
      *.log
      /build
    `);
    fs.writeFileSync(path.join(testDir, 'test.log'), 'Test log file');
    fs.mkdirSync(path.join(testDir, 'build'), { recursive: true });
    fs.writeFileSync(path.join(testDir, 'build', 'main.js'), 'console.log("Hello");');
    fs.writeFileSync(path.join(testDir, 'src.js'), 'console.log("Not ignored");');
  });

  afterAll(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    linter = new ContextignoreLinter();
  });

  describe('lintContextignoreFile', () => {
    it('should validate a correct .contextignore file', async () => {
      const content = await fs.promises.readFile(path.join(testDir, '.contextignore'), 'utf-8');
      const result = await linter.lintContextignoreFile(content, path.join(testDir, '.contextignore'));
      expect(result).toBe(true);
      expect(linter.getErrorMessages()).toHaveLength(0);
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
      expect(linter.getErrorMessages()).toContain('Error: Invalid pattern at line 4: invalid**pattern');
    });

    it('should detect attempts to ignore critical files', async () => {
      const content = `
        node_modules/
        *.log
        .context.md
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(false);
      expect(linter.getErrorMessages()).toContain('Error: Pattern at line 3 ignores critical file: .context.md');
    });

    it('should not produce errors for valid patterns', async () => {
      const content = `
        node_modules/
        *.log
        /build
        !important.log
      `;
      const result = await linter.lintContextignoreFile(content, 'test/.contextignore');
      expect(result).toBe(true);
      expect(linter.getErrorMessages()).toHaveLength(0);
    });
  });

  describe('isIgnored', () => {
    beforeEach(async () => {
      const content = await fs.promises.readFile(path.join(testDir, '.contextignore'), 'utf-8');
      await linter.lintContextignoreFile(content, path.join(testDir, '.contextignore'));
    });

    it('should correctly identify ignored files', () => {
      expect(linter.isIgnored(path.join(testDir, 'test.log'), testDir)).toBe(true);
      expect(linter.isIgnored(path.join(testDir, 'build', 'main.js'), testDir)).toBe(true);
    });

    it('should correctly identify non-ignored files', () => {
      expect(linter.isIgnored(path.join(testDir, 'src.js'), testDir)).toBe(false);
    });
  });

  describe('getIgnoredFiles', () => {
    beforeEach(async () => {
      const content = await fs.promises.readFile(path.join(testDir, '.contextignore'), 'utf-8');
      await linter.lintContextignoreFile(content, path.join(testDir, '.contextignore'));
    });

    it('should return a list of ignored files', () => {
      const ignoredFiles = linter.getIgnoredFiles(testDir);
      const normalizedIgnoredFiles = ignoredFiles.map(file => path.normalize(file));
      
      expect(normalizedIgnoredFiles).toEqual(expect.arrayContaining([
        path.join(testDir, 'test.log'),
        path.join(testDir, 'build', 'main.js')
      ]));
      expect(normalizedIgnoredFiles).not.toContain(path.join(testDir, 'src.js'));
    });
  });
});