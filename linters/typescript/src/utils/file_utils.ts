import * as fs from 'fs/promises';
import * as path from 'path';

export async function getContextFiles(directoryPath: string, isIgnored: (filePath: string, relativeTo: string) => boolean): Promise<string[]> {
  const files = await fs.readdir(directoryPath);
  return files.filter(file => 
    (file.endsWith('.context.md') || 
     file.endsWith('.context.yaml') || 
     file.endsWith('.context.json')) &&
    !isIgnored(file, directoryPath)
  );
}

export async function lintFileIfExists(filePath: string, lintFunction: (content: string) => Promise<boolean>): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return await lintFunction(content);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      console.error(`Error reading file ${filePath}: ${error}`);
    }
    return false;
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
Codebase Context Specification (CCS) Linter (v${packageVersion})
========================================================
`);
  console.log(`Linting directory: ${directoryPath}\n`);
}