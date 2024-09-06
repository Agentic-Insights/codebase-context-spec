import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { ContextdocsLinter } from './contextdocs_linter';
import { ContextignoreLinter } from './contextignore_linter';
import { getContextFiles, lintFileIfExists, fileExists, printHeader } from './utils/file_utils';
import { ContextValidator } from './utils/validator';

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

  public async lintDirectory(directoryPath: string, packageVersion: string): Promise<boolean> {
    printHeader(packageVersion, directoryPath);
    let isValid = true;
    isValid = await this.handleContextignore(directoryPath) && isValid;
    isValid = await this.handleContextdocs(directoryPath) && isValid;
    isValid = await this.handleContextFilesRecursively(directoryPath) && isValid;

    console.log('\nLinting completed.');
    return isValid;
  }

  private async handleContextignore(directoryPath: string): Promise<boolean> {
    const contextignorePath = path.join(directoryPath, '.contextignore');
    return await lintFileIfExists(contextignorePath, this.contextignoreLinter.lintContextignoreFile.bind(this.contextignoreLinter)) || true;
  }

  private async handleContextdocs(directoryPath: string): Promise<boolean> {
    const contextdocsPath = path.join(directoryPath, '.contextdocs.md');
    const result = await lintFileIfExists(contextdocsPath, this.contextdocsLinter.lintContextdocsFile.bind(this.contextdocsLinter));

    if (path.resolve(directoryPath) === path.resolve(process.cwd()) && !await fileExists(contextdocsPath)) {
      console.error('\nError: .contextdocs.md file is missing in the root directory.');
      return false;
    }

    return result || true;
  }

  private async handleContextFilesRecursively(directoryPath: string): Promise<boolean> {
    const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    let isValid = true;

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        isValid = await this.handleContextFilesRecursively(fullPath) && isValid;
      } else if (entry.isFile() && (entry.name.endsWith('.context.md') || entry.name.endsWith('.context.yaml') || entry.name.endsWith('.context.json'))) {
        isValid = await this.lintContextFile(fullPath) && isValid;
      }
    }

    return isValid;
  }

  private async lintContextFile(filePath: string): Promise<boolean> {
    console.log(`\nLinting file: ${filePath}`);
    return await lintFileIfExists(filePath, async (fileContent) => {
      let isValid = false;
      if (filePath.endsWith('.context.md')) {
        isValid = await this.lintMarkdownFile(fileContent);
      } else if (filePath.endsWith('.context.yaml')) {
        isValid = await this.lintYamlFile(fileContent);
      } else if (filePath.endsWith('.context.json')) {
        isValid = await this.lintJsonFile(fileContent);
      }
      this.printValidationResult(isValid, filePath);
      return isValid;
    }) || false;
  }

  private printValidationResult(isValid: boolean, filePath: string): void {
    const fileName = path.basename(filePath);
    if (isValid) {
      console.log(`  ✅ ${fileName} passed validation`);
    } else {
      console.error(`  ❌ ${fileName} failed validation`);
    }
  }

  private async lintMarkdownFile(content: string): Promise<boolean> {
    console.log('  - Validating Markdown structure');
    console.log('  - Checking YAML frontmatter');

    try {
      const { data: frontmatterData, content: markdownContent } = matter(content);
      const frontmatterValid = await this.contextValidator.validateContextData(frontmatterData, 'markdown');
      const markdownValid = this.validateMarkdownContent(markdownContent.trim());
      return frontmatterValid && markdownValid;
    } catch (error) {
      console.error(`  Error parsing Markdown file: ${error}`);
      return false;
    }
  }

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

  private async lintYamlFile(content: string): Promise<boolean> {
    console.log('  - Validating YAML structure');

    try {
      const yamlData = this.parseYaml(content);
      return await this.contextValidator.validateContextData(yamlData, 'yaml');
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        console.error(`  Error parsing YAML file: ${this.formatYamlError(error)}`);
      } else {
        console.error(`  Error parsing YAML file: ${error}`);
      }
      return false;
    }
  }

  private async lintJsonFile(content: string): Promise<boolean> {
    console.log('  - Validating JSON structure');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      return await this.contextValidator.validateContextData(jsonData, 'json');
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`  Error parsing JSON file: ${this.formatJsonError(error, content)}`);
      } else {
        console.error(`  Error parsing JSON file: ${error}`);
      }
      return false;
    }
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
}