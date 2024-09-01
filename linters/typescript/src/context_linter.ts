import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';

export class ContextLinter {
  private md: MarkdownIt;
  private kebabToCamelCache: Map<string, string>;
  private requiredFields: Set<string>;
  private roleSpecificSections: Set<string>;
  private sectionChecks: Record<string, Set<string>>;

  constructor() {
    this.md = new MarkdownIt();
    this.kebabToCamelCache = new Map();
    this.requiredFields = new Set(['project-name', 'version', 'description', 'main-technologies']);
    this.roleSpecificSections = new Set(['architecture', 'development', 'business-requirements', 'quality-assurance', 'deployment']);
    this.sectionChecks = {
      architecture: new Set(['style', 'main-components', 'data-flow']),
      development: new Set(['setup-steps', 'build-command', 'test-command']),
      'business-requirements': new Set(['key-features', 'target-audience', 'success-metrics']),
      'quality-assurance': new Set(['testing-frameworks', 'coverage-threshold', 'performance-benchmarks']),
      deployment: new Set(['platform', 'cicd-pipeline', 'staging-environment', 'production-environment'])
    };
  }

  public async lintDirectory(directoryPath: string, packageVersion: string): Promise<void> {
    console.log(`
========================================================
AI Context Convention Linter (v${packageVersion})
========================================================
`);
    console.log(`Linting directory: ${directoryPath}\n`);

    const files = await this.getContextFiles(directoryPath);
    if (files.length === 0) {
      console.log('No context files found in the specified directory.');
      return;
    }

    await Promise.all(files.map(file => this.lintFile(file)));

    // Lint .contextdocs.md and .contextignore if they exist
    const contextdocsPath = path.join(directoryPath, '.contextdocs.md');
    const contextignorePath = path.join(directoryPath, '.contextignore');

    await Promise.all([
      this.lintFileIfExists(contextdocsPath, this.lintContextdocsFile.bind(this)),
      this.lintFileIfExists(contextignorePath, this.lintContextignoreFile.bind(this))
    ]);

    console.log('\nLinting completed.');
  }

  private async getContextFiles(directoryPath: string): Promise<string[]> {
    const files = await fs.readdir(directoryPath);
    return files.filter(file => 
      file.endsWith('.context.md') || 
      file.endsWith('.context.yaml') || 
      file.endsWith('.context.json')
    );
  }

  private async lintFileIfExists(filePath: string, lintFunction: (content: string) => void): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      lintFunction(content);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        console.error(`Error reading file ${filePath}: ${error}`);
      }
    }
  }

  private async lintFile(filePath: string): Promise<void> {
    console.log(`\nLinting file: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    
    if (filePath.endsWith('.context.md')) {
      this.lintMarkdownFile(content);
    } else if (filePath.endsWith('.context.yaml')) {
      this.lintYamlFile(content);
    } else if (filePath.endsWith('.context.json')) {
      this.lintJsonFile(content);
    }
  }

  private lintMarkdownFile(content: string): void {
    console.log('  - Validating Markdown structure');
    console.log('  - Checking YAML frontmatter');
    console.log('  - Verifying content against AI Context Convention Specification');

    const parts = content.split('---\n');
    if (parts.length < 3) {
      console.error('  Error: Invalid markdown structure. YAML frontmatter is missing or incomplete.');
      return;
    }

    const frontmatter = parts[1];
    const markdownContent = parts.slice(2).join('---\n').trim();

    try {
      const frontmatterData = yaml.load(frontmatter) as Record<string, unknown>;
      this.validateContextData(frontmatterData, 'markdown');
    } catch (error) {
      console.error(`  Error parsing YAML frontmatter: ${error}`);
    }

    this.validateMarkdownContent(markdownContent);
  }

  private validateContextData(data: Record<string, unknown>, format: 'markdown' | 'yaml' | 'json'): void {
    const isJson = format === 'json';
    
    for (const field of this.requiredFields) {
      const fieldName = isJson ? this.kebabToCamelCase(field) : field;
      if (!(fieldName in data)) {
        console.error(`  Error: Missing required field '${fieldName}'.`);
      }
    }

    for (const section of this.roleSpecificSections) {
      const sectionName = isJson ? this.kebabToCamelCase(section) : section;
      if (!(sectionName in data)) {
        console.warn(`  Warning: Missing role-specific section '${sectionName}'.`);
      } else {
        this.validateRoleSpecificSection(sectionName, data[sectionName] as Record<string, unknown>, isJson);
      }
    }

    if ('conventions' in data && !Array.isArray(data.conventions)) {
      console.error('  Error: Field \'conventions\' must be an array.');
    }

    const aiPromptsField = isJson ? 'aiPrompts' : 'ai-prompts';
    if (aiPromptsField in data && !Array.isArray(data[aiPromptsField])) {
      console.error(`  Error: Field '${aiPromptsField}' must be an array.`);
    }
  }

  private validateRoleSpecificSection(sectionName: string, data: Record<string, unknown>, isJson: boolean): void {
    const checks = this.sectionChecks[sectionName];
    if (checks) {
      for (const field of checks) {
        const fieldName = isJson ? this.kebabToCamelCase(field) : field;
        if (!(fieldName in data)) {
          console.warn(`  Warning: Missing field '${fieldName}' in '${sectionName}' section.`);
        }
      }
    }
  }

  private kebabToCamelCase(str: string): string {
    if (this.kebabToCamelCache.has(str)) {
      return this.kebabToCamelCache.get(str)!;
    }
    const result = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    this.kebabToCamelCache.set(str, result);
    return result;
  }

  private validateMarkdownContent(content: string): void {
    const tokens = this.md.parse(content, {});
    const sections = new Set<string>();
    let hasTitle = false;

    for (const token of tokens) {
      if (token.type === 'heading_open') {
        if (token.tag === 'h1' && !hasTitle) {
          hasTitle = true;
        } else if (token.tag === 'h2') {
          sections.add(tokens[tokens.indexOf(token) + 1].content.toLowerCase());
        }
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

    const expectedSections = [
      'architecture overview',
      'development guidelines',
      'business context',
      'quality assurance',
      'deployment and operations'
    ];

    for (const section of expectedSections) {
      if (!sections.has(section)) {
        console.warn(`  Warning: Markdown content is missing a "${section}" section.`);
      }
    }
  }

  private lintYamlFile(content: string): void {
    console.log('  - Validating YAML structure');
    console.log('  - Verifying content against AI Context Convention Specification');

    try {
      const yamlData = yaml.load(content) as Record<string, unknown>;
      this.validateContextData(yamlData, 'yaml');
    } catch (error) {
      console.error(`  Error parsing YAML file: ${error}`);
    }
  }

  private lintJsonFile(content: string): void {
    console.log('  - Validating JSON structure');
    console.log('  - Verifying content against AI Context Convention Specification');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      this.validateContextData(jsonData, 'json');
      
      // Check for invalid field types
      if (typeof jsonData.mainTechnologies === 'string') {
        console.error('  Error: Invalid field \'mainTechnologies\'. Expected an array, but got a string.');
      }
    } catch (error) {
      console.error(`  Error parsing JSON file: ${error}`);
    }
  }

  private lintContextdocsFile(content: string): void {
    console.log('\nLinting .contextdocs.md file');
    console.log('  - Validating Markdown structure');
    console.log('  - Checking for required sections');
    console.log('  - Verifying content against .contextdocs.md specification');
    
    const tokens = this.md.parse(content, {});
    const sections = new Set<string>();
    let hasTitle = false;

    for (const token of tokens) {
      if (token.type === 'heading_open') {
        if (token.tag === 'h1' && !hasTitle) {
          hasTitle = tokens[tokens.indexOf(token) + 1].content === 'AI Context Documentation';
        } else if (token.tag === 'h2') {
          sections.add(tokens[tokens.indexOf(token) + 1].content.toLowerCase());
        }
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
      console.error('  Error: .contextdocs.md should start with the title "AI Context Documentation".');
    }

    const expectedSections = ['overview', 'file structure', 'conventions'];
    for (const section of expectedSections) {
      if (!sections.has(section)) {
        console.error(`  Error: .contextdocs.md is missing the "${section}" section.`);
      }
    }
  }

  private lintContextignoreFile(content: string): void {
    console.log('\nLinting .contextignore file');
    console.log('  - Validating .contextignore format');
    console.log('  - Checking for valid ignore patterns');
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'));
    const patterns = new Set<string>();
    const criticalPatterns = new Set(['.context.md', '.context.yaml', '.context.json', '.contextdocs.md', '.contextignore']);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!/^[!#]?[\w\-./\*\?]+$/.test(line)) {
        console.error(`  Error: Invalid ignore pattern on line ${i + 1}: ${line}`);
      }

      if (patterns.has(line)) {
        console.warn(`  Warning: Redundant pattern on line ${i + 1}: ${line}`);
      }

      for (const criticalPattern of criticalPatterns) {
        if (line.endsWith(criticalPattern) || line.includes(`/${criticalPattern}`)) {
          console.error(`  Error: Ignoring critical context file on line ${i + 1}: ${line}`);
        }
      }

      patterns.add(line);
    }

    this.checkConflictingPatterns(Array.from(patterns));
  }

  private checkConflictingPatterns(patterns: string[]): void {
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        if (patterns[i].startsWith('!') && patterns[j] === patterns[i].slice(1) ||
            patterns[j].startsWith('!') && patterns[i] === patterns[j].slice(1)) {
          console.warn(`  Warning: Conflicting patterns: "${patterns[i]}" and "${patterns[j]}"`);
        }
      }
    }
  }
}