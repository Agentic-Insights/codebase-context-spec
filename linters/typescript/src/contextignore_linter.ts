export class ContextignoreLinter {
  private criticalPatterns: Set<string>;

  constructor() {
    this.criticalPatterns = new Set(['.context.md', '.context.yaml', '.context.json', '.contextdocs.md', '.contextignore']);
  }

  public async lintContextignoreFile(content: string): Promise<boolean> {
    console.log('\nLinting .contextignore file');
    console.log('  - Validating .contextignore format');
    console.log('  - Checking for valid ignore patterns');
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'));
    const patterns = new Set<string>();
    let isValid = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!/^[!#]?[\w\-./\*\?]+$/.test(line)) {
        console.error(`  Error: Invalid ignore pattern on line ${i + 1}: ${line}`);
        isValid = false;
      }

      if (patterns.has(line)) {
        console.warn(`  Warning: Redundant pattern on line ${i + 1}: ${line}`);
      }

      for (const criticalPattern of this.criticalPatterns) {
        if (line.endsWith(criticalPattern) || line.includes(`/${criticalPattern}`)) {
          console.error(`  Error: Ignoring critical context file on line ${i + 1}: ${line}`);
          isValid = false;
        }
      }

      patterns.add(line);
    }

    isValid = this.checkConflictingPatterns(Array.from(patterns)) && isValid;

    return isValid;
  }

  private checkConflictingPatterns(patterns: string[]): boolean {
    let isValid = true;
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        if (patterns[i].startsWith('!') && patterns[j] === patterns[i].slice(1) ||
            patterns[j].startsWith('!') && patterns[i] === patterns[j].slice(1)) {
          console.warn(`  Warning: Conflicting patterns: "${patterns[i]}" and "${patterns[j]}"`);
          isValid = false;
        }
      }
    }
    return isValid;
  }
}