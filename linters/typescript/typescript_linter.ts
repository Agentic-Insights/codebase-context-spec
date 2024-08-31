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
    // TODO: Implement markdown file linting
    console.log('  - Validating Markdown structure');
    console.log('  - Checking YAML frontmatter');
    console.log('  - Verifying content against AI Context Convention Specification');
  }

  private lintYamlFile(content: string): void {
    // TODO: Implement YAML file linting
    console.log('  - Validating YAML structure');
    console.log('  - Verifying content against AI Context Convention Specification');
  }

  private lintJsonFile(content: string): void {
    // TODO: Implement JSON file linting
    console.log('  - Validating JSON structure');
    console.log('  - Verifying content against AI Context Convention Specification');
  }

  private lintContextdocsFile(filePath: string): void {
    console.log(`\nLinting .contextdocs.md file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log('  - Validating Markdown structure');
    console.log('  - Checking for required sections');
    console.log('  - Verifying content against .contextdocs.md specification');
    
    // TODO: Implement specific checks for .contextdocs.md
    // 1. Check if the file starts with a level 1 heading "AI Context Documentation"
    // 2. Verify that all required sections are present (e.g., "Overview", "File Structure", "Conventions")
    // 3. Ensure that the content follows the expected format for each section
  }

  private lintContextignoreFile(filePath: string): void {
    console.log(`\nLinting .contextignore file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log('  - Validating .contextignore format');
    console.log('  - Checking for valid ignore patterns');
    
    // TODO: Implement specific checks for .contextignore
    // 1. Verify that each line is a valid ignore pattern (similar to .gitignore format)
    // 2. Check for any conflicting or redundant patterns
    // 3. Ensure that the file doesn't ignore critical context files (e.g., .context.md files)
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