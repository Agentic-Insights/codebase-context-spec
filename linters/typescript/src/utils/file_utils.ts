import * as fs from 'fs/promises';
import * as path from 'path';

export async function getContextFiles(directoryPath: string): Promise<string[]> {
  const files = await fs.readdir(directoryPath);
  return files.filter(file => 
    file.endsWith('.context.md') || 
    file.endsWith('.context.yaml') || 
    file.endsWith('.context.json')
  );
}

export async function lintFileIfExists(filePath: string, lintFunction: (content: string) => void): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    lintFunction(content);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      console.error(`Error reading file ${filePath}: ${error}`);
    }
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function printHeader(packageVersion: string, directoryPath: string): void {
  console.log(`
========================================================
AI Context Convention Linter (v${packageVersion})
========================================================
`);
  console.log(`Linting directory: ${directoryPath}\n`);
}