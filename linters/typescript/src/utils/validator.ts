import * as fs from 'fs';
import * as path from 'path';
import { kebabToCamelCase } from './string_utils';
import { allowedTopLevelFields, sectionChecks, listTypes, stringTypes, directoryTypes } from './context_structure';

export interface SectionValidationResult {
  isValid: boolean;
  coveragePercentage: number;
  coveredFields: number;
  totalFields: number;
  missingFields: string[];
  unexpectedFields: string[];
}

export interface ValidationResult {
  isValid: boolean;
  coveragePercentage: number;
  coveredFields: number;
  totalFields: number;
  missingFields: string[];
  sections: Record<string, SectionValidationResult>;
}

export class ContextValidator {
  private kebabToCamelCache: Map<string, string>;

  constructor() {
    this.kebabToCamelCache = new Map();
  }

  public validateContextData(data: Record<string, unknown>, format: 'markdown' | 'yaml' | 'json'): ValidationResult {
    const isJson = format === 'json';
    const coveredFields = new Set<string>();
    let isValid = true;
    const allMissingFields: string[] = [];
    const sections: Record<string, SectionValidationResult> = {};
    
    for (const [field, value] of Object.entries(data)) {
      const normalizedField = isJson ? kebabToCamelCase(field, this.kebabToCamelCache) : field;
      
      if (allowedTopLevelFields.has(normalizedField)) {
        coveredFields.add(normalizedField);
        isValid = this.validateField(normalizedField, value, isJson) && isValid;
      } else {
        console.warn(`  Warning: Unexpected top-level field '${normalizedField}'.`);
        isValid = false;
      }
    }

    const { coveragePercentage, missingFields } = this.calculateCoverage(coveredFields, allowedTopLevelFields);
    allMissingFields.push(...missingFields);

    for (const section of Object.keys(sectionChecks)) {
      if (section in data) {
        const sectionResult = this.validateSectionFields(section, data[section] as Record<string, unknown>, isJson);
        isValid = sectionResult.isValid && isValid;
        allMissingFields.push(...sectionResult.missingFields);
        sections[section] = sectionResult;
      }
    }

    return {
      isValid,
      coveragePercentage,
      coveredFields: coveredFields.size,
      totalFields: allowedTopLevelFields.size,
      missingFields: allMissingFields,
      sections
    };
  }

  private validateField(field: string, value: unknown, isJson: boolean): boolean {
    let isValid = true;
    if (listTypes.has(field) && !Array.isArray(value)) {
      console.error(`  Error: Field '${field}' should be an array.`);
      isValid = false;
    } else if (stringTypes.has(field) && typeof value !== 'string') {
      console.error(`  Error: Field '${field}' should be a string.`);
      isValid = false;
    } else if (directoryTypes.has(field)) {
      if (field === 'related-modules' && Array.isArray(value)) {
        for (const modulePath of value) {
          if (typeof modulePath === 'string' && !this.isValidRelatedModule(modulePath)) {
            console.error(`  Error: Related module '${modulePath}' is not a valid directory containing a .context file.`);
            isValid = false;
          }
        }
      } else if (field === 'diagrams' && Array.isArray(value)) {
        for (const diagramPath of value) {
          if (typeof diagramPath === 'string' && !this.isValidDiagram(diagramPath)) {
            console.error(`  Error: Diagram '${diagramPath}' is not a valid file or URL.`);
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  private isValidRelatedModule(modulePath: string): boolean {
    if (!fs.existsSync(modulePath) || !fs.statSync(modulePath).isDirectory()) {
      return false;
    }
    const contextFiles = ['.context.md', '.context.json', '.context.yaml', '.context.yml'];
    return contextFiles.some(file => fs.existsSync(path.join(modulePath, file)));
  }

  private isValidDiagram(diagramPath: string): boolean {
    if (diagramPath.startsWith('http://') || diagramPath.startsWith('https://')) {
      // Assume URLs are valid diagrams
      return true;
    }
    if (!fs.existsSync(diagramPath)) {
      return false;
    }
    const allowedExtensions = ['.mermaid', '.mmd', '.pdf', '.png', '.jpeg', '.jpg'];
    return allowedExtensions.includes(path.extname(diagramPath).toLowerCase());
  }

  private validateSectionFields(sectionName: string, data: Record<string, unknown>, isJson: boolean): SectionValidationResult {
    const checks = sectionChecks[sectionName];
    const coveredFields = new Set<string>();
    const unexpectedFields: string[] = [];
    let isValid = true;

    if (checks) {
      for (const [field, value] of Object.entries(data)) {
        const normalizedField = isJson ? kebabToCamelCase(field, this.kebabToCamelCache) : field;
        
        if (checks.has(normalizedField)) {
          coveredFields.add(normalizedField);
          isValid = this.validateField(normalizedField, value, isJson) && isValid;
        } else {
          unexpectedFields.push(normalizedField);
          isValid = false;
        }
      }

      const { coveragePercentage, missingFields } = this.calculateCoverage(coveredFields, checks);

      return {
        isValid,
        coveragePercentage,
        coveredFields: coveredFields.size,
        totalFields: checks.size,
        missingFields,
        unexpectedFields
      };
    }

    return {
      isValid: true,
      coveragePercentage: 100,
      coveredFields: 0,
      totalFields: 0,
      missingFields: [],
      unexpectedFields: []
    };
  }

  private calculateCoverage(coveredFields: Set<string>, expectedFields: Set<string>): { coveragePercentage: number, missingFields: string[] } {
    const missingFields = Array.from(expectedFields).filter(field => !coveredFields.has(field));
    const coveragePercentage = (coveredFields.size / expectedFields.size) * 100;
    return { coveragePercentage, missingFields };
  }
}