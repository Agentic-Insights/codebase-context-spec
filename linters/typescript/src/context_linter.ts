import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
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

  public async lintDirectory(directoryPath: string, packageVersion: string): Promise<void> {
    printHeader(packageVersion, directoryPath);
    await this.handleContextignore(directoryPath);
    await this.handleContextdocs(directoryPath);
    await this.handleContextFilesRecursively(directoryPath);

    console.log('\nLinting completed.');
  }

  private async handleContextignore(directoryPath: string): Promise<void> {
    const contextignorePath = path.join(directoryPath, '.contextignore');
    await lintFileIfExists(contextignorePath, this.contextignoreLinter.lintContextignoreFile.bind(this.contextignoreLinter));
  }

  private async handleContextdocs(directoryPath: string): Promise<void> {
    const contextdocsPath = path.join(directoryPath, '.contextdocs.md');
    await lintFileIfExists(contextdocsPath, this.contextdocsLinter.lintContextdocsFile.bind(this.contextdocsLinter));

    if (path.resolve(directoryPath) === path.resolve(process.cwd()) && !await fileExists(contextdocsPath)) {
      console.error('\nError: .contextdocs.md file is missing in the root directory.');
    }
  }

  private async handleContextFilesRecursively(directoryPath: string): Promise<void> {
    const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        await this.handleContextFilesRecursively(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.context.md') || entry.name.endsWith('.context.yaml') || entry.name.endsWith('.context.json'))) {
        await this.lintContextFile(fullPath);
      }
    }
  }

  private async lintContextFile(filePath: string): Promise<void> {
    console.log(`\nLinting file: ${filePath}`);
    await lintFileIfExists(filePath, (fileContent) => {
      if (filePath.endsWith('.context.md')) {
        this.lintMarkdownFile(fileContent);
      } else if (filePath.endsWith('.context.yaml')) {
        this.lintYamlFile(fileContent);
      } else if (filePath.endsWith('.context.json')) {
        this.lintJsonFile(fileContent);
      }
    });
  }

  private lintMarkdownFile(content: string): void {
    console.log('  - Validating Markdown structure');
    console.log('  - Checking YAML frontmatter');

    const parts = content.split('---\n');
    if (parts.length < 3) {
      console.error('  Error: Invalid markdown structure. YAML frontmatter is missing or incomplete.');
      return;
    }

    const frontmatter = parts[1];
    const markdownContent = parts.slice(2).join('---\n').trim();

    try {
      const frontmatterData = yaml.load(frontmatter) as Record<string, unknown>;
      this.contextValidator.validateContextData(frontmatterData, 'markdown');
    } catch (error) {
      console.error(`  Error parsing YAML frontmatter: ${error}`);
    }

    this.validateMarkdownContent(markdownContent);
  }

  private validateMarkdownContent(content: string): void {
    const tokens = this.md.parse(content, {});
    let hasTitle = false;

    for (const token of tokens) {
      if (token.type === 'heading_open' && token.tag === 'h1' && !hasTitle) {
        hasTitle = true;
      }

      if (token.type === 'link_open') {
        const hrefToken = tokens[tokens.indexOf(token) + 1];
        if (hrefToken.type !== 'text' || !hrefToken.content.startsWith('http')) {
          console.error('  Warning: Link may be improperly formatted or using relative path.');
        }
      }

      if (token.type === 'fence' && !token.info) {
        console.error('  Warning: Code block is missing language specification.');
      }
    }

    if (!hasTitle) {
      console.error('  Error: Markdown content should start with a title (H1 heading).');
    }
  }

  private lintYamlFile(content: string): void {
    console.log('  - Validating YAML structure');

    try {
      const yamlData = yaml.load(content) as Record<string, unknown>;
      this.contextValidator.validateContextData(yamlData, 'yaml');
    } catch (error) {
      console.error(`  Error parsing YAML file: ${error}`);
    }
  }

  private lintJsonFile(content: string): void {
    console.log('  - Validating JSON structure');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      this.contextValidator.validateContextData(jsonData, 'json');
    } catch (error) {
      console.error(`  Error parsing JSON file: ${error}`);
    }
  }
}