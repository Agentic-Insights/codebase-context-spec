import { ContextLinter } from '../context_linter';
import { ContextignoreLinter } from '../contextignore_linter';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

jest.mock('../contextignore_linter');

describe('ContextLinter', () => {
  let linter: ContextLinter;
  let mockContextignoreLinter: jest.Mocked<ContextignoreLinter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContextignoreLinter = new ContextignoreLinter() as jest.Mocked<ContextignoreLinter>;
    linter = new ContextLinter();
    (linter as any).contextignoreLinter = mockContextignoreLinter;
  });

  describe('lintDirectory', () => {
    it('should lint a directory successfully', async () => {
      const mockFiles = [
        { name: '.contextignore', isDirectory: () => false },
        { name: '.context.md', isDirectory: () => false },
        { name: 'subdir', isDirectory: () => true },
      ];

      (fs.promises.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.promises.readFile as jest.Mock).mockResolvedValue('# Mock content');
      mockContextignoreLinter.lintContextignoreFile.mockResolvedValue(true);
      mockContextignoreLinter.isIgnored.mockReturnValue(false);

      const result = await linter.lintDirectory('/mock/path', '1.0.0');

      expect(result).toBe(true);
      expect(mockContextignoreLinter.lintContextignoreFile).toHaveBeenCalled();
      expect(mockContextignoreLinter.isIgnored).toHaveBeenCalled();
    });

    it('should respect .contextignore rules', async () => {
      const mockFiles = [
        { name: '.contextignore', isDirectory: () => false },
        { name: 'ignored.md', isDirectory: () => false },
        { name: 'not_ignored.md', isDirectory: () => false },
      ];

      (fs.promises.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.promises.readFile as jest.Mock).mockResolvedValue('# Mock content');
      mockContextignoreLinter.lintContextignoreFile.mockResolvedValue(true);
      mockContextignoreLinter.isIgnored
        .mockReturnValueOnce(false) // .contextignore
        .mockReturnValueOnce(true)  // ignored.md
        .mockReturnValueOnce(false); // not_ignored.md

      await linter.lintDirectory('/mock/path', '1.0.0');

      expect(mockContextignoreLinter.isIgnored).toHaveBeenCalledTimes(3);
      // Ensure that lintContextFile is not called for ignored.md
      expect((linter as any).lintContextFile).not.toHaveBeenCalledWith(expect.stringContaining('ignored.md'));
    });
  });

  describe('handleContextignoreRecursively', () => {
    it('should process .contextignore files in nested directories', async () => {
      const mockStructure = [
        { name: '.contextignore', isDirectory: () => false },
        { name: 'subdir', isDirectory: () => true },
      ];
      const mockSubdirStructure = [
        { name: '.contextignore', isDirectory: () => false },
      ];

      (fs.promises.readdir as jest.Mock)
        .mockResolvedValueOnce(mockStructure)
        .mockResolvedValueOnce(mockSubdirStructure);
      (fs.promises.readFile as jest.Mock).mockResolvedValue('# Mock content');
      mockContextignoreLinter.lintContextignoreFile.mockResolvedValue(true);

      await (linter as any).handleContextignoreRecursively('/mock/path');

      expect(mockContextignoreLinter.lintContextignoreFile).toHaveBeenCalledTimes(2);
    });
  });

  // Add more tests for other methods as needed
});