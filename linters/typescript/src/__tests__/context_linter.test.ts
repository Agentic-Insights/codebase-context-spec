import { ContextLinter } from '../context_linter';
import * as fs from 'fs';
import * as path from 'path';

describe('ContextLinter', () => {
  let linter: ContextLinter;
  const testDir = path.join(__dirname, 'test_context');

  beforeAll(() => {
    // Create test directory and files
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, '.contextignore'), `\n      ignored.md\n    `);
    fs.writeFileSync(path.join(testDir, '.context.md'), `---\nmodule-name: test-module\nrelated-modules: []\nversion: 1.0.0\ndescription: A test module\ndiagrams: []\ntechnologies: ['TypeScript', 'Jest']\nconventions: ['Use camelCase for variables']\ndirectives: []\narchitecture:\n  style: 'Modular'\n  components: ['Component A', 'Component B']\n  data-flow: ['Component A -> Component B']\ndevelopment:\n  setup-steps: ['Install dependencies', 'Configure environment']\n  build-command: 'npm run build'\n  test-command: 'npm test'\nbusiness-requirements:\n  key-features: ['Feature 1', 'Feature 2']\n  target-audience: 'Developers'\n  success-metrics: ['Code coverage', 'Performance']\nquality-assurance:\n  testing-frameworks: ['Jest']\n  coverage-threshold: '80%'\n  performance-benchmarks: ['Load time < 1s']\ndeployment:\n  platform: 'AWS'\n  cicd-pipeline: 'GitHub Actions'\n  staging-environment: 'staging.example.com'\n  production-environment: 'production.example.com'\n---\n# Test Module\n\nThis is a test module.\n    `);
    fs.writeFileSync(path.join(testDir, 'ignored.md'), 'This file should be ignored');
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

    it('should respect .contextignore rules and process .context files', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const result = await linter.lintDirectory(testDir, '1.0.0');
      
      // Check that the ignored file is not processed
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('ignored.md'));
      
      // Check that the .context.md file is processed
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('.context.md'));
      
      // Check that the linting process completed successfully
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Linting completed.');

      consoleSpy.mockRestore();
    });
  });

  describe('handleContextFilesRecursively', () => {
    it('should process .context files in nested directories', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await linter.lintDirectory(testDir, '1.0.0');
      
      // Check if the main context was processed (which should be the .context.md file)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Main context:'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Main context:.*100\.00%/));

      consoleSpy.mockRestore();
    });
  });

  // Add more tests for other methods as needed
});