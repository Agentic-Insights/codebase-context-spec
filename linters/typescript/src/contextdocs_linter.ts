import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import * as path from 'path';

export class ContextdocsLinter {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt();
  }

  public async lintContextdocsFile(content: string, filePath: string): Promise<boolean> {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`\nLinting file: ${relativePath}`);
    
    const { data: frontmatter, content: markdownContent } = matter(content);

    const frontmatterLinksResult = this.lintFrontmatter(frontmatter);
    const similarLinksResult = this.checkSimilarLinks(markdownContent, frontmatterLinksResult.links);

    console.log('- Validating YAML front matter structure');
    console.log('- Checking for similar links in markdown content');

    if (!frontmatterLinksResult.isValid || !similarLinksResult) {
      console.warn('⚠️  File has validation warnings');
    }

    console.log(''); // Add a blank line for better readability
    return frontmatterLinksResult.isValid && similarLinksResult;
  }

  private lintFrontmatter(frontmatter: Record<string, unknown>): { isValid: boolean, links: Set<string> } {
    const links = new Set<string>();
    let isValid = true;

    if (!frontmatter || typeof frontmatter !== 'object') {
      console.error('  Error: Invalid YAML front matter structure.');
      return { isValid: false, links };
    }

    if (!('contextdocs' in frontmatter) || !Array.isArray(frontmatter.contextdocs)) {
      console.error('  Error: Missing or invalid "contextdocs" array in YAML front matter.');
      return { isValid: false, links };
    }

    for (const item of frontmatter.contextdocs) {
      if (typeof item !== 'object' || item === null) {
        console.error('  Error: Invalid item in "contextdocs" array.');
        isValid = false;
        continue;
      }

      const requiredFields = ['name', 'relationship', 'resources'];
      for (const field of requiredFields) {
        if (!(field in item)) {
          console.error(`  Error: Missing required field "${field}" in contextdocs item.`);
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
              console.error(`  Error: Invalid resource URL format. Should be a string. Found: ${JSON.stringify(resource)}`);
              isValid = false;
            }
          } else {
            console.error(`  Error: Invalid resource format. Should be an object with a single key-value pair. Found: ${JSON.stringify(resource)}`);
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
        console.warn(`  Warning: Link "${link}" appears in both frontmatter and markdown content.`);
        isValid = false;
      }
    }

    return isValid;
  }
}