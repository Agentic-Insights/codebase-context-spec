import ignore from 'ignore';
import * as path from 'path';
import * as fs from 'fs';
import { LogLevel } from './context_linter';

/**
 * ContextignoreLinter class handles the linting of .contextignore files
 * and provides functionality to check if files should be ignored based on the ignore patterns.
 */
export class ContextignoreLinter {
  // Set of patterns that should never be ignored
  private criticalPatterns: Set<string>;
  // Cache of ignore instances for each directory
  private ignoreCache: Map<string, ReturnType<typeof ignore>>;
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.criticalPatterns = new Set(['.context.md', '.context.yaml', '.context.json', '.contextdocs.md', '.contextignore']);
    this.ignoreCache = new Map();
    this.logLevel = logLevel;
  }

  private log(level: LogLevel, message: string): void {
    if (level <= this.logLevel) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(message);
          break;
        case LogLevel.WARN:
          console.warn(message);
          break;
        case LogLevel.INFO:
        case LogLevel.DEBUG:
          console.log(message);
          break;
      }
    }
  }

  /**
   * Lint a .contextignore file
   * @param content The content of the .contextignore file
   * @param filePath The path of the .contextignore file
   * @returns A boolean indicating whether the file is valid
   */
  public async lintContextignoreFile(content: string, filePath: string): Promise<boolean> {
    try {
      const relativePath = path.relative(process.cwd(), filePath);
      this.log(LogLevel.INFO, `\nLinting file: ${relativePath}`);
      this.log(LogLevel.INFO, '- Validating .contextignore format');
      this.log(LogLevel.INFO, '- Checking for valid ignore patterns');

      const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'));
      const patterns = new Set<string>();
      let isValid = true;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Updated regex to catch more invalid patterns, including "invalid**pattern"
        if (!/^!?(?:[\w\-./]+|\*(?!\*)|\?+|\[.+\])+$/.test(line)) {
          this.log(LogLevel.ERROR, `Error: Invalid pattern at line ${i + 1}: ${line}`);
          isValid = false;
        }

        // Validate that critical patterns are not being ignored
        isValid = this.validateCriticalPattern(line, i) && isValid;

        patterns.add(line);
      }

      // Check for conflicting patterns
      isValid = this.checkConflictingPatterns(Array.from(patterns)) && isValid;

      if (isValid) {
        this.updateIgnoreCache(filePath, Array.from(patterns));
      } else {
        this.log(LogLevel.WARN, '⚠️  File has validation warnings');
      }

      this.log(LogLevel.INFO, ''); // Add a blank line for better readability
      return isValid;
    } catch (error) {
      this.log(LogLevel.ERROR, `Error linting .contextignore file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Validate that a pattern does not ignore critical files
   * @param pattern The pattern to validate
   * @param lineNumber The line number of the pattern in the file
   * @returns A boolean indicating whether the pattern is valid
   */
  private validateCriticalPattern(pattern: string, lineNumber: number): boolean {
    for (const criticalPattern of this.criticalPatterns) {
      if (pattern.endsWith(criticalPattern) || pattern.includes(`/${criticalPattern}`)) {
        this.log(LogLevel.ERROR, `Error: Pattern at line ${lineNumber + 1} ignores critical file: ${criticalPattern}`);
        return false;
      }
    }
    return true;
  }

  /**
   * Check for conflicting patterns (e.g., a pattern and its negation)
   * @param patterns The list of patterns to check
   * @returns A boolean indicating whether there are no conflicts
   */
  private checkConflictingPatterns(patterns: string[]): boolean {
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        if (patterns[i].startsWith('!') && patterns[j] === patterns[i].slice(1) ||
            patterns[j].startsWith('!') && patterns[i] === patterns[j].slice(1)) {
          this.log(LogLevel.ERROR, `Error: Conflicting patterns found: ${patterns[i]} and ${patterns[j]}`);
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Update the ignore cache for a directory
   * @param filePath The path of the .contextignore file
   * @param patterns The list of ignore patterns
   */
  private updateIgnoreCache(filePath: string, patterns: string[]): void {
    try {
      const ig = ignore().add(patterns);
      this.ignoreCache.set(path.dirname(filePath), ig);
    } catch (error) {
      this.log(LogLevel.ERROR, `Error updating ignore cache for ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if a file should be ignored based on the ignore patterns
   * @param filePath The path of the file to check
   * @param relativeTo The base directory to resolve relative paths
   * @returns A boolean indicating whether the file should be ignored
   */
  public isIgnored(filePath: string, relativeTo: string): boolean {
    try {
      const directoryPath = path.dirname(filePath);
      let currentDir = directoryPath;

      // Traverse up the directory tree to find the nearest .contextignore file
      while (currentDir.length >= relativeTo.length) {
        const ig = this.ignoreCache.get(currentDir);
        if (ig) {
          const relativeFilePath = path.relative(currentDir, filePath);
          return ig.ignores(relativeFilePath);
        }
        currentDir = path.dirname(currentDir);
      }

      return false;
    } catch (error) {
      this.log(LogLevel.ERROR, `Error checking if file ${filePath} is ignored: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Clear the ignore cache
   */
  public clearCache(): void {
    this.ignoreCache.clear();
  }

  /**
   * Get a list of ignored files in a directory
   * @param directoryPath The path of the directory to check
   * @returns An array of ignored file paths
   */
  public getIgnoredFiles(directoryPath: string): string[] {
    try {
      const ig = this.ignoreCache.get(directoryPath);
      if (!ig) {
        return [];
      }

      // Get all files in the directory
      const allFiles = this.getAllFiles(directoryPath);

      // Filter the files using the ignore patterns
      return allFiles.filter(file => {
        const relativePath = path.relative(directoryPath, file);
        return ig.ignores(relativePath);
      });
    } catch (error) {
      this.log(LogLevel.ERROR, `Error getting ignored files for directory ${directoryPath}: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Get all files in a directory recursively
   * @param directoryPath The path of the directory to check
   * @returns An array of file paths
   */
  private getAllFiles(directoryPath: string): string[] {
    const files: string[] = [];

    const walk = (dir: string) => {
      const dirents = fs.readdirSync(dir, { withFileTypes: true });
      for (const dirent of dirents) {
        const res = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
          walk(res);
        } else {
          files.push(res);
        }
      }
    };

    walk(directoryPath);
    return files;
  }
}