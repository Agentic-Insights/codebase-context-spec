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
      this.validateContextData(frontmatterData);
    } catch (error) {
      console.error(`  Error parsing YAML frontmatter: ${error}`);
    }

    // Validate markdown content
    this.validateMarkdownContent(markdownContent);
  }

  private validateContextData(data: Record<string, unknown>): void {
    const requiredFields = ['directoryName', 'description'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        console.error(`  Error: Missing required field '${field}'.`);
      }
    }

    if ('language' in data && typeof data.language !== 'string') {
      console.error('  Error: Field \'language\' must be a string.');
    }

    if ('dependencies' in data && !Array.isArray(data.dependencies)) {
      console.error('  Error: Field \'dependencies\' must be an array.');
    }

    // Add more specific checks as needed
  }

  private validateMarkdownContent(content: string): void {
    const tokens = this.md.parse(content, {});
    let hasTitle = false;
    let hasDescriptionSection = false;
    let hasFileStructureSection = false;
    let hasUsageSection = false;
    let currentSection = '';

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'heading_open') {
        if (token.tag === 'h1' && !hasTitle) {
          hasTitle = true;
        } else if (token.tag === 'h2') {
          currentSection = tokens[i + 1].content.toLowerCase();
          if (currentSection === 'description') hasDescriptionSection = true;
          if (currentSection === 'file structure') hasFileStructureSection = true;
          if (currentSection === 'usage') hasUsageSection = true;
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

    if (!hasDescriptionSection) {
      console.error('  Warning: Markdown content is missing a "Description" section.');
    }

    if (!hasFileStructureSection) {
      console.warn('  Note: Consider adding a "File Structure" section for better context.');
    }

    if (!hasUsageSection) {
      console.warn('  Note: Consider adding a "Usage" section for better understanding.');
    }
  }

  private lintYamlFile(content: string): void {
    console.log('  - Validating YAML structure');
    console.log('  - Verifying content against AI Context Convention Specification');

    try {
      const yamlData = yaml.load(content) as Record<string, unknown>;
      this.validateContextData(yamlData);
    } catch (error) {
      console.error(`  Error parsing YAML file: ${error}`);
    }
  }

  private lintJsonFile(content: string): void {
    console.log('  - Validating JSON structure');
    console.log('  - Verifying content against AI Context Convention Specification');

    try {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      this.validateContextData(jsonData);
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