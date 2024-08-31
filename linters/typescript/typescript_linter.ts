import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';

let packageVersion = 'unknown';
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  packageVersion = packageJson.version;
} catch (error) {
  console.warn('Warning: Unable to read package.json file. Version information may not be accurate.');
}

class TypeScriptLinter {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt();
  }

  public lintDirectory(directoryPath: string): void {
    console.log(`
========================================================
AI Context Convention TypeScript Linter (v${packageVersion})
========================================================
`);
    console.log(`Linting directory: ${directoryPath}\n`);

    const files = this.getContextFiles(directoryPath);
    if (files.length === 0) {
      console.log('No context files found in the specified directory.');
      return;
    }

    for (const file of files) {
      this.lintFile(file);
    }

    // Lint .contextdocs.md and .contextignore if they exist
    const contextdocsPath = path.join(directoryPath, '.contextdocs.md');
    const contextignorePath = path.join(directoryPath, '.contextignore');

    if (fs.existsSync(contextdocsPath)) {
      this.lintContextdocsFile(contextdocsPath);
    }

    if (fs.existsSync(contextignorePath)) {
      this.lintContextignoreFile(contextignorePath);
    }

    console.log('\nLinting completed.');
  }

  private getContextFiles(directoryPath: string): string[] {
    const files = fs.readdirSync(directoryPath);
    return files.filter(file => 
      file.endsWith('.context.md') || 
      file.endsWith('.context.yaml') || 
      file.endsWith('.context.json')
    );
  }

  private lintFile(filePath: string): void {
    console.log(`\nLinting file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
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

    // Split content into frontmatter and markdown
    const parts = content.split('---\n');
    if (parts.length < 3) {
      console.error('  Error: Invalid markdown structure. YAML frontmatter is missing or incomplete.');
      return;
    }

    const frontmatter = parts[1];
    const markdownContent = parts.slice(2).join('---\n').trim();

    // Parse and validate frontmatter
    try {
      const frontmatterData = yaml.load(frontmatter) as Record<string, unknown>;
      this.validateContextData(frontmatterData, 'markdown');
    } catch (error) {
      console.error(`  Error parsing YAML frontmatter: ${error}`);
    }

    // Validate markdown content
    this.validateMarkdownContent(markdownContent);
  }

  private validateContextData(data: Record<string, unknown>, format: 'markdown' | 'yaml' | 'json'): void {
    const requiredFields = ['project-name', 'version', 'description', 'main-technologies'];
    const roleSpecificSections = ['architecture', 'development', 'business-requirements', 'quality-assurance', 'deployment'];
    
    for (const field of requiredFields) {
      const fieldName = format === 'json' ? this.kebabToCamelCase(field) : field;
      if (!(fieldName in data)) {
        console.error(`  Error: Missing required field '${fieldName}'.`);
      }
    }

    for (const section of roleSpecificSections) {
      const sectionName = format === 'json' ? this.kebabToCamelCase(section) : section;
      if (!(sectionName in data)) {
        console.warn(`  Warning: Missing role-specific section '${sectionName}'.`);
      } else {
        this.validateRoleSpecificSection(sectionName, data[sectionName] as Record<string, unknown>, format);
      }
    }

    if ('conventions' in data && !Array.isArray(data.conventions)) {
      console.error('  Error: Field \'conventions\' must be an array.');
    }

    if ('ai-prompts' in data && !Array.isArray(data['ai-prompts'])) {
      console.error('  Error: Field \'ai-prompts\' must be an array.');
    }

    // Add more specific checks as needed
  }

  private validateRoleSpecificSection(sectionName: string, data: Record<string, unknown>, format: 'markdown' | 'yaml' | 'json'): void {
    const sectionChecks: Record<string, string[]> = {
      architecture: ['style', 'main-components', 'data-flow'],
      development: ['setup-steps', 'build-command', 'test-command'],
      'business-requirements': ['key-features', 'target-audience', 'success-metrics'],
      'quality-assurance': ['testing-frameworks', 'coverage-threshold', 'performance-benchmarks'],
      deployment: ['platform', 'cicd-pipeline', 'staging-environment', 'production-environment']
    };

    const checks = sectionChecks[sectionName];
    if (checks) {
      for (const field of checks) {
        const fieldName = format === 'json' ? this.kebabToCamelCase(field) : field;
        if (!(fieldName in data)) {
          console.warn(`  Warning: Missing field '${fieldName}' in '${sectionName}' section.`);
        }
      }
    }
  }

  private kebabToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  private validateMarkdownContent(content: string): void {
    const tokens = this.md.parse(content, {});
    let hasTitle = false;
    let hasArchitectureOverview = false;
    let hasDevelopmentGuidelines = false;
    let hasBusinessContext = false;
    let hasQualityAssurance = false;
    let hasDeploymentAndOperations = false;
    let currentSection = '';

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'heading_open') {
        if (token.tag === 'h1' && !hasTitle) {
          hasTitle = true;
        } else if (token.tag === 'h2') {
          currentSection = tokens[i + 1].content.toLowerCase();
          if (currentSection === 'architecture overview') hasArchitectureOverview = true;
          if (currentSection === 'development guidelines') hasDevelopmentGuidelines = true;
          if (currentSection === 'business context') hasBusinessContext = true;
          if (currentSection === 'quality assurance') hasQualityAssurance = true;
          if (currentSection === 'deployment and operations') hasDeploymentAndOperations = true;
        }
      }

      if (token.type === 'link_open') {
        const hrefToken = tokens[i + 1];
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

    if (!hasArchitectureOverview) {
      console.warn('  Warning: Markdown content is missing an "Architecture Overview" section.');
    }

    if (!hasDevelopmentGuidelines) {
      console.warn('  Warning: Markdown content is missing a "Development Guidelines" section.');
    }

    if (!hasBusinessContext) {
      console.warn('  Warning: Markdown content is missing a "Business Context" section.');
    }

    if (!hasQualityAssurance) {
      console.warn('  Warning: Markdown content is missing a "Quality Assurance" section.');
    }

    if (!hasDeploymentAndOperations) {
      console.warn('  Warning: Markdown content is missing a "Deployment and Operations" section.');
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
    } catch (error) {
      console.error(`  Error parsing JSON file: ${error}`);
    }
  }

  private lintContextdocsFile(filePath: string): void {
    console.log(`\nLinting .contextdocs.md file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log('  - Validating Markdown structure');
    console.log('  - Checking for required sections');
    console.log('  - Verifying content against .contextdocs.md specification');
    
    const tokens = this.md.parse(content, {});
    let hasTitle = false;
    let hasOverview = false;
    let hasFileStructure = false;
    let hasConventions = false;
    let currentSection = '';

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'heading_open') {
        if (token.tag === 'h1' && !hasTitle) {
          hasTitle = tokens[i + 1].content === 'AI Context Documentation';
        } else if (token.tag === 'h2') {
          currentSection = tokens[i + 1].content.toLowerCase();
          if (currentSection === 'overview') hasOverview = true;
          if (currentSection === 'file structure') hasFileStructure = true;
          if (currentSection === 'conventions') hasConventions = true;
        }
      }

      if (token.type === 'link_open') {
        const hrefToken = tokens[i + 1];
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

    if (!hasOverview) {
      console.error('  Error: .contextdocs.md is missing the "Overview" section.');
    }

    if (!hasFileStructure) {
      console.error('  Error: .contextdocs.md is missing the "File Structure" section.');
    }

    if (!hasConventions) {
      console.error('  Error: .contextdocs.md is missing the "Conventions" section.');
    }
  }

  private lintContextignoreFile(filePath: string): void {
    console.log(`\nLinting .contextignore file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log('  - Validating .contextignore format');
    console.log('  - Checking for valid ignore patterns');
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'));
    const patterns: string[] = [];
    const criticalPatterns = ['.context.md', '.context.yaml', '.context.json', '.contextdocs.md', '.contextignore'];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for valid pattern format
      if (!/^[!#]?[\w\-./\*\?]+$/.test(line)) {
        console.error(`  Error: Invalid ignore pattern on line ${i + 1}: ${line}`);
      }

      // Check for redundant patterns
      if (patterns.includes(line)) {
        console.warn(`  Warning: Redundant pattern on line ${i + 1}: ${line}`);
      }

      // Check for critical file ignores
      for (const criticalPattern of criticalPatterns) {
        if (line.endsWith(criticalPattern) || line.includes(`/${criticalPattern}`)) {
          console.error(`  Error: Ignoring critical context file on line ${i + 1}: ${line}`);
        }
      }

      patterns.push(line);
    }

    // Check for conflicting include/exclude patterns
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

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error(`
Usage: npm run lint <directory_to_lint>

AI Context Convention TypeScript Linter (v${packageVersion})
This tool validates context files, including .contextdocs.md and .contextignore, according to the AI Context Convention Specification.
`);
    process.exit(1);
  }

  const directoryToLint = args[0];
  const linter = new TypeScriptLinter();
  linter.lintDirectory(directoryToLint);
}

main();