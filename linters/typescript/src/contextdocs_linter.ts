import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import * as path from 'path';
import { LogLevel } from './context_linter';

export class ContextdocsLinter {
  private md: MarkdownIt;
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.md = new MarkdownIt();
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

  public async lintContextdocsFile(content: string, filePath: string): Promise<boolean> {
    const relativePath = path.relative(process.cwd(), filePath);
    this.log(LogLevel.INFO, `\nLinting file: ${relativePath}`);
    
    const { data: frontmatter, content: markdownContent } = matter(content);

    const frontmatterLinksResult = this.lintFrontmatter(frontmatter);
    const similarLinksResult = this.checkSimilarLinks(markdownContent, frontmatterLinksResult.links);
    this.log(LogLevel.INFO, '- Validating YAML front matter structure');

    if (!frontmatterLinksResult.isValid || !similarLinksResult) {
      this.log(LogLevel.WARN, '⚠️  File has validation warnings');
    }

    this.log(LogLevel.INFO, ''); // Add a blank line for better readability
    return frontmatterLinksResult.isValid && similarLinksResult;
  }

  private lintFrontmatter(frontmatter: Record<string, unknown>): { isValid: boolean, links: Set<string> } {
    const links = new Set<string>();
    let isValid = true;

    if (!frontmatter || typeof frontmatter !== 'object') {
      this.log(LogLevel.ERROR, '  Error: Invalid YAML front matter structure.');
      return { isValid: false, links };
    }

    if (!('contextdocs' in frontmatter) || !Array.isArray(frontmatter.contextdocs)) {
      this.log(LogLevel.ERROR, '  Error: Missing or invalid "contextdocs" array in YAML front matter.');
      return { isValid: false, links };
    }

    for (const item of frontmatter.contextdocs) {
      if (typeof item !== 'object' || item === null) {
        this.log(LogLevel.ERROR, '  Error: Invalid item in "contextdocs" array.');
        isValid = false;
        continue;
      }

      const requiredFields = ['name', 'relationship', 'resources'];
      for (const field of requiredFields) {
        if (!(field in item)) {
          this.log(LogLevel.ERROR, `  Error: Missing required field "${field}" in contextdocs item.`);
          isValid = false;
        }
      }

      if ('url' in item && typeof item.url === 'string') {
        links.add(item.url);
      }

      if ('resources' in item && Array.isArray(item.resources)) {
        for (const resource of item.resources) {
          if (typeof resource === 'object' && resource !== null) {
            const [title, url] = Object.entries(resource)[0];
            if (typeof url === 'string') {
              links.add(url);
            } else {
              this.log(LogLevel.ERROR, `  Error: Invalid resource URL format. Should be a string. Found: ${JSON.stringify(resource)}`);
              isValid = false;
            }
          } else {
            this.log(LogLevel.ERROR, `  Error: Invalid resource format. Should be an object with a single key-value pair. Found: ${JSON.stringify(resource)}`);
            isValid = false;
          }
        }
      }
    }

    return { isValid, links };
  }

  private checkSimilarLinks(content: string, frontmatterLinks: Set<string>): boolean {
    const tokens = this.md.parse(content, {});
    const markdownLinks = new Set<string>();
    let isValid = true;

    for (const token of tokens) {
      if (token.type === 'link_open') {
        const hrefToken = token.attrs?.find(attr => attr[0] === 'href');
        if (hrefToken) {
          const url = hrefToken[1];
          markdownLinks.add(url);
        }
      }
    }

    for (const link of markdownLinks) {
      if (frontmatterLinks.has(link)) {
        this.log(LogLevel.WARN, `  Warning: Link "${link}" appears in both frontmatter and markdown content.`);
        isValid = false;
      }
    }

    return isValid;
  }
}