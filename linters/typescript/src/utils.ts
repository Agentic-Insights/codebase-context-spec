import * as fs from 'fs/promises';
import * as path from 'path';

export async function getPackageVersion(): Promise<string> {
  try {
    const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Warning: Unable to read package.json file. Version information may not be accurate.');
    return 'unknown';
  }
}