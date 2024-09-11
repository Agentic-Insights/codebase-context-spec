import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { ContextdocsLinter } from './contextdocs_linter';
import { ContextignoreLinter } from './contextignore_linter';
import { getContextFiles, lintFileIfExists, fileExists, printHeader } from './utils/file_utils';
import { ContextValidator, ValidationResult, SectionValidationResult } from './utils/validator';

/**
 * ContextLinter class handles the linting of .context files (md, yaml, json)
 * and coordinates the use of ContextignoreLinter and ContextdocsLinter.
 */
export class ContextLinter {
  private md: MarkdownIt;
  private contextdocsLinter: ContextdocsLinter;
  private contextignoreLinter: ContextignoreLinter;
  private contextValidator: ContextValidator;

  constructor() {
    this.md = new MarkdownIt();
    this.contextdocsLinter = new ContextdocsLinter();
    this.contextignoreLinter = new ContextignoreLinter();
    this.contextValidator = new ContextValidator();
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
        this.printValidationResult(result, rootContextFile);
        isValid = isValid && result.isValid;
      }
      
      isValid = await this.handleContextdocs(directoryPath) && isValid;
      isValid = await this.handleContextFilesRecursively(directoryPath) && isValid;

      // Log ignored files
      this.logIgnoredFiles(directoryPath);

      // Clear ignore cache after processing the directory
      this.contextignoreLinter.clearCache();

      console.log('Linting completed.');
      
      return isValid;
    } catch (error) {
      console.error(`Error linting directory: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
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
    const contextFiles = await getContextFiles(directoryPath);
    
    for (const filePath of contextFiles) {
      if (!this.contextignoreLinter.isIgnored(filePath, directoryPath)) {
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
            console.warn(`Unsupported file extension: ${fileExtension}`);
            continue;
        }

        this.printValidationResult(result, fullPath);
        isValid = isValid && result.isValid;
      }
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
   * Log ignored files in the directory
   * @param directoryPath The path of the directory to check for ignored files
   */
  private logIgnoredFiles(directoryPath: string): void {
    const ignoredFiles = this.contextignoreLinter.getIgnoredFiles(directoryPath);
    if (ignoredFiles.length > 0) {
      console.log('\nIgnored files:');
      for (const file of ignoredFiles) {
        console.log(`  ${this.normalizePath(file)}`);
      }
    }
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
      console.error(`  Error parsing Markdown file: ${error}`);
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
          console.error('  Warning: Link may be improperly formatted or using relative path.');
          isValid = false;
        }
      }

      if (token.type === 'fence' && !token.info) {
        console.error('  Warning: Code block is missing language specification.');
        isValid = false;
      }
    }

    if (!hasTitle) {
      console.error('  Error: Markdown content should start with a title (H1 heading).');
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
    console.log('  - Validating YAML structure');

    try {
      const yamlData = this.parseYaml(content);
      return this.contextValidator.validateContextData(yamlData, 'yaml');
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        console.error(`  Error parsing YAML file: ${this.formatYamlError(error)}`);
      } else {
        console.error(`  Error parsing YAML file: ${error}`);
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
    console.log('  - Validating JSON structure');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      return this.contextValidator.validateContextData(jsonData, 'json');
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`  Error parsing JSON file: ${this.formatJsonError(error, content)}`);
      } else {
        console.error(`  Error parsing JSON file: ${error}`);
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
   */
  private printValidationResult(result: ValidationResult, filePath: string): void {
    const relativePath = this.normalizePath(path.relative(process.cwd(), filePath));
    console.log(`Linting file: ${relativePath}`);
    
    console.log(`main context: ${result.coveragePercentage.toFixed(2)}% (${result.coveredFields}/${result.totalFields} top level fields)`);
    
    for (const [sectionName, sectionResult] of Object.entries(result.sections)) {
      console.log(`|- ${sectionName}: ${sectionResult.coveragePercentage.toFixed(2)}% (${sectionResult.coveredFields}/${sectionResult.totalFields} fields)`);
    }
    
    if (!result.isValid) {
      console.warn(`⚠️  File has coverage warnings`);
    }
    
    console.log(''); // Add a blank line for better readability
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