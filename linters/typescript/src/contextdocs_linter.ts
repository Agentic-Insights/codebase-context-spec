import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

export class ContextdocsLinter {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt();
  }

  public lintContextdocsFile(content: string): void {
    console.log('\nLinting .contextdocs.md file');
    console.log('  - Checking for similar links in markdown content');
    
    const { data: frontmatter, content: markdownContent } = matter(content);

    const frontmatterLinks = this.lintFrontmatter(frontmatter);
    this.checkSimilarLinks(markdownContent, frontmatterLinks);
  }

  private lintFrontmatter(frontmatter: Record<string, unknown>): Set<string> {
    const links = new Set<string>();

    if (!frontmatter || typeof frontmatter !== 'object') {
      console.error('  Error: Invalid YAML front matter structure.');
      return links;
    }

    if (!('contextdocs' in frontmatter) || !Array.isArray(frontmatter.contextdocs)) {
      console.error('  Error: Missing or invalid "contextdocs" array in YAML front matter.');
      return links;
    }

    for (const item of frontmatter.contextdocs) {
      if (typeof item !== 'object' || item === null) {
        console.error('  Error: Invalid item in "contextdocs" array.');
        continue;
      }

      const requiredFields = ['name', 'relationship', 'resources'];
      for (const field of requiredFields) {
        if (!(field in item)) {
          console.error(`  Error: Missing required field "${field}" in contextdocs item.`);
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
            }
          } else {
            console.error(`  Error: Invalid resource format. Should be an object with a single key-value pair. Found: ${JSON.stringify(resource)}`);
          }
        }
      }
    }

    return links;
  }

  private checkSimilarLinks(content: string, frontmatterLinks: Set<string>): void {
    const tokens = this.md.parse(content, {});
    const markdownLinks = new Set<string>();

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
      }
    }
  }
}