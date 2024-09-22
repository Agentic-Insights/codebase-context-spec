import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { ContextdocsLinter } from './contextdocs_linter';
import { ContextignoreLinter } from './contextignore_linter';
import { getContextFiles, lintFileIfExists, fileExists, printHeader } from './utils/file_utils';
import { ContextValidator, ValidationResult, SectionValidationResult } from './utils/validator';

export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG
}

/**
 * ContextLinter class handles the linting of .context files (md, yaml, json)
 * and coordinates the use of ContextignoreLinter and ContextdocsLinter.
 */
export class ContextLinter {
  private md: MarkdownIt;
  private contextdocsLinter: ContextdocsLinter;
  private contextignoreLinter: ContextignoreLinter;
  private contextValidator: ContextValidator;
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.md = new MarkdownIt();
    this.contextdocsLinter = new ContextdocsLinter(logLevel);
    this.contextignoreLinter = new ContextignoreLinter(logLevel);
    this.contextValidator = new ContextValidator(logLevel);
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
   * Main method to lint a directory
   * @param directoryPath The path of the directory to lint
   * @param packageVersion The version of the linter package
   * @returns A boolean indicating whether the linting was successful
   */
  public async lintDirectory(directoryPath: string, packageVersion: string): Promise<boolean> {
    try {
      printHeader(packageVersion, directoryPath);
      let isValid = true;
      
      // Initialize ignore patterns
      await this.initializeIgnorePatterns(directoryPath);
      
      // Lint .context.md file in the root directory
      const rootContextFile = path.join(directoryPath, '.context.md');
      if (await fileExists(rootContextFile)) {
        const content = await fs.promises.readFile(rootContextFile, 'utf-8');
        const result = await this.lintMarkdownFile(content, rootContextFile);
        this.printValidationResult(result, rootContextFile, this.logLevel === LogLevel.DEBUG);
        isValid = isValid && result.isValid;
      }
      
      isValid = await this.handleContextdocs(directoryPath) && isValid;
      isValid = await this.handleContextFilesRecursively(directoryPath) && isValid;

      // Report on .contextignore usage
      this.reportContextignoreUsage(directoryPath);

      // Clear all caches after processing the directory
      this.clearAllCaches();

      this.log(LogLevel.INFO, 'Linting completed.');
      
      return isValid;
    } catch (error) {
      this.log(LogLevel.ERROR, `Error linting directory: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Clear all caches from linter components
   */
  private clearAllCaches(): void {
    this.contextignoreLinter.clearCache();
    this.contextValidator.clearCache();
  }

  /**
   * Initialize ignore patterns from .contextignore file
   * @param directoryPath The path of the directory containing .contextignore
   */
  private async initializeIgnorePatterns(directoryPath: string): Promise<void> {
    const contextignorePath = path.join(directoryPath, '.contextignore');
    if (await fileExists(contextignorePath)) {
      const content = await fs.promises.readFile(contextignorePath, 'utf-8');
      await this.contextignoreLinter.lintContextignoreFile(content, contextignorePath);
      this.log(LogLevel.INFO, `Found .contextignore file at ${this.normalizePath(contextignorePath)}`);
    } else {
      this.log(LogLevel.INFO, 'No .contextignore file found. All files will be processed.');
    }
  }

  /**
   * Handle .contextdocs file in the directory
   * @param directoryPath The path of the directory to check for .contextdocs
   * @returns A boolean indicating whether the .contextdocs file is valid
   */
  private async handleContextdocs(directoryPath: string): Promise<boolean> {
    const contextdocsPath = path.join(directoryPath, '.contextdocs.md');
    if (await fileExists(contextdocsPath)) {
      const content = await fs.promises.readFile(contextdocsPath, 'utf-8');
      return await this.contextdocsLinter.lintContextdocsFile(content, contextdocsPath);
    }
    return true;
  }

  /**
   * Handle .context files recursively in the directory
   * @param directoryPath The path of the directory to process
   * @returns A boolean indicating whether all .context files are valid
   */
  private async handleContextFilesRecursively(directoryPath: string): Promise<boolean> {
    let isValid = true;
    const contextFiles = await getContextFiles(directoryPath, (filePath, relativeTo) => this.contextignoreLinter.isIgnored(filePath, relativeTo));
    
    for (const filePath of contextFiles) {
      const fullPath = path.join(directoryPath, filePath);
      const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
      const fileExtension = path.extname(fullPath);
      let result: ValidationResult;

      switch (fileExtension) {
        case '.md':
          result = await this.lintMarkdownFile(fileContent, fullPath);
          break;
        case '.yaml':
        case '.yml':
          result = await this.lintYamlFile(fileContent, fullPath);
          break;
        case '.json':
          result = await this.lintJsonFile(fileContent, fullPath);
          break;
        default:
          this.log(LogLevel.WARN, `Unsupported file extension: ${fileExtension}`);
          continue;
      }

      this.printValidationResult(result, fullPath, this.logLevel === LogLevel.DEBUG);
      isValid = isValid && result.isValid;
    }

    // Recursively process subdirectories
    const subdirectories = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    for (const dirent of subdirectories) {
      if (dirent.isDirectory() && !this.contextignoreLinter.isIgnored(dirent.name, directoryPath)) {
        const subdirectoryPath = path.join(directoryPath, dirent.name);
        isValid = await this.handleContextFilesRecursively(subdirectoryPath) && isValid;
      }
    }

    return isValid;
  }

  /**
   * Report on .contextignore usage
   * @param directoryPath The path of the directory to check for ignored files
   */
  private reportContextignoreUsage(directoryPath: string): void {
    const ignoredFiles = this.contextignoreLinter.getIgnoredFiles(directoryPath);
    const ignoredDirectories = this.contextignoreLinter.getIgnoredDirectories(directoryPath);
    
    this.log(LogLevel.INFO, '\n.contextignore Usage Report:');
    this.log(LogLevel.INFO, `Total ignored files: ${ignoredFiles.length}`);
    this.log(LogLevel.INFO, `Total ignored directories: ${ignoredDirectories.length}`);
    
    if (this.logLevel === LogLevel.DEBUG) {
      if (ignoredFiles.length > 0) {
        this.log(LogLevel.DEBUG, '\nIgnored files:');
        for (const file of ignoredFiles) {
          this.log(LogLevel.DEBUG, `  ${this.normalizePath(file)}`);
        }
      }
      if (ignoredDirectories.length > 0) {
        this.log(LogLevel.DEBUG, '\nIgnored directories:');
        for (const dir of ignoredDirectories) {
          this.log(LogLevel.DEBUG, `  ${this.normalizePath(dir)}`);
        }
      }
    }
    
    this.log(LogLevel.INFO, ''); // Add a blank line for better readability
  }

  /**
   * Lint a Markdown .context file
   * @param content The content of the file
   * @param filePath The path of the file
   * @returns A ValidationResult object
   */
  private async lintMarkdownFile(content: string, filePath: string): Promise<ValidationResult> {
    try {
      const { data: frontmatterData, content: markdownContent } = matter(content);
      const validationResult = this.contextValidator.validateContextData(frontmatterData, 'markdown');
      const markdownValid = this.validateMarkdownContent(markdownContent.trim());
      
      return {
        ...validationResult,
        isValid: validationResult.isValid && markdownValid
      };
    } catch (error) {
      this.log(LogLevel.ERROR, `  Error parsing Markdown file: ${error}`);
      return {
        isValid: false,
        coveragePercentage: 0,
        coveredFields: 0,
        totalFields: 0,
        missingFields: [],
        sections: {}
      };
    }
  }

  /**
   * Validate the content of a Markdown file
   * @param content The Markdown content to validate
   * @returns A boolean indicating whether the content is valid
   */
  private validateMarkdownContent(content: string): boolean {
    const tokens = this.md.parse(content, {});
    let hasTitle = false;
    let isValid = true;

    for (const token of tokens) {
      if (token.type === 'heading_open' && token.tag === 'h1' && !hasTitle) {
        hasTitle = true;
      }

      if (token.type === 'link_open') {
        const hrefToken = tokens[tokens.indexOf(token) + 1];
        if (hrefToken.type !== 'text' || !hrefToken.content.startsWith('http')) {
          this.log(LogLevel.WARN, '  Warning: Link may be improperly formatted or using relative path.');
          isValid = false;
        }
      }

      if (token.type === 'fence' && !token.info) {
        this.log(LogLevel.WARN, '  Warning: Code block is missing language specification.');
        isValid = false;
      }
    }

    if (!hasTitle) {
      this.log(LogLevel.ERROR, '  Error: Markdown content should start with a title (H1 heading).');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Lint a YAML .context file
   * @param content The content of the file
   * @param filePath The path of the file
   * @returns A ValidationResult object
   */
  private async lintYamlFile(content: string, filePath: string): Promise<ValidationResult> {
    this.log(LogLevel.DEBUG, '  - Validating YAML structure');

    try {
      const yamlData = this.parseYaml(content);
      return this.contextValidator.validateContextData(yamlData, 'yaml');
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        this.log(LogLevel.ERROR, `  Error parsing YAML file: ${this.formatYamlError(error)}`);
      } else {
        this.log(LogLevel.ERROR, `  Error parsing YAML file: ${error}`);
      }
      return {
        isValid: false,
        coveragePercentage: 0,
        coveredFields: 0,
        totalFields: 0,
        missingFields: [],
        sections: {}
      };
    }
  }

  /**
   * Lint a JSON .context file
   * @param content The content of the file
   * @param filePath The path of the file
   * @returns A ValidationResult object
   */
  private async lintJsonFile(content: string, filePath: string): Promise<ValidationResult> {
    this.log(LogLevel.DEBUG, '  - Validating JSON structure');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      return this.contextValidator.validateContextData(jsonData, 'json');
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.log(LogLevel.ERROR, `  Error parsing JSON file: ${this.formatJsonError(error, content)}`);
      } else {
        this.log(LogLevel.ERROR, `  Error parsing JSON file: ${error}`);
      }
      return {
        isValid: false,
        coveragePercentage: 0,
        coveredFields: 0,
        totalFields: 0,
        missingFields: [],
        sections: {}
      };
    }
  }

  /**
   * Print the validation result for a .context file
   * @param result The validation result
   * @param filePath The path of the file
   * @param isDebug Whether the linter is in debug mode
   */
  private printValidationResult(result: ValidationResult, filePath: string, isDebug: boolean): void {
    const relativePath = this.normalizePath(path.relative(process.cwd(), filePath));
    this.log(LogLevel.INFO, `Linting file: ${relativePath}`);
    
    if (isDebug) {
      this.log(LogLevel.INFO, '(Debug mode: ON)');
    }
    
    // Display main context coverage information at INFO level
    this.log(LogLevel.INFO, `Main context: ${result.coveragePercentage.toFixed(2)}% (${result.coveredFields}/${result.totalFields} top level fields)`);
    
    // Display detailed section coverage information
    let incompleteSections = false;
    for (const [sectionName, sectionResult] of Object.entries(result.sections)) {
      if (isDebug || sectionResult.coveragePercentage < 100) {
        this.log(LogLevel.INFO, `|- ${sectionName}: ${sectionResult.coveragePercentage.toFixed(2)}% (${sectionResult.coveredFields}/${sectionResult.totalFields} fields)`);
        if (sectionResult.coveragePercentage < 100) {
          incompleteSections = true;
        }
      }
    }
    
    if (!result.isValid || incompleteSections) {
      this.log(LogLevel.WARN, `⚠️  File has coverage warnings`);
    }
    
    this.log(LogLevel.INFO, ''); // Add a blank line for better readability
  }

  private parseYaml(content: string): Record<string, unknown> {
    const documents = yaml.loadAll(content) as Record<string, unknown>[];
    if (documents.length === 0) {
      throw new Error('YAML content is empty');
    }
    return documents[0];
  }

  private formatYamlError(error: yaml.YAMLException): string {
    return `${error.message} (line ${error.mark.line + 1}, column ${error.mark.column + 1})`;
  }

  private formatJsonError(error: SyntaxError, content: string): string {
    const lines = content.split('\n');
    const match = error.message.match(/at position (\d+)/);
    if (match) {
      let position = parseInt(match[1], 10);
      let line = 0;
      let column = 0;
      for (let i = 0; i < lines.length; i++) {
        if (position <= lines[i].length) {
          line = i + 1;
          column = position + 1;
          break;
        }
        position -= lines[i].length + 1; // +1 for the newline character
      }
      return `${error.message} (line ${line}, column ${column})`;
    }
    return error.message;
  }

  private normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }
}