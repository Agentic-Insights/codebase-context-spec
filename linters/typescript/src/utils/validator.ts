import { kebabToCamelCase } from './string_utils';
import { allowedTopLevelFields, sectionChecks, listTypes, stringTypes, directoryTypes } from './context_structure';

export interface ValidationResult {
  isValid: boolean;
  coveragePercentage: number;
  missingFields: string[];
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
    console.log(`  Context coverage: ${coveragePercentage.toFixed(2)}% (${coveredFields.size}/${allowedTopLevelFields.size} fields)`);
    if (missingFields.length > 0) {
      console.log(`  Missing top-level fields: ${missingFields.join(', ')}`);
    }

    for (const section of Object.keys(sectionChecks)) {
      if (section in data) {
        const sectionResult = this.validateSectionFields(section, data[section] as Record<string, unknown>, isJson);
        isValid = sectionResult.isValid && isValid;
        allMissingFields.push(...sectionResult.missingFields);
      }
    }

    return { isValid, coveragePercentage, missingFields: allMissingFields };
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
      // Additional validation for directory types can be added here
    }
    return isValid;
  }

  private validateSectionFields(sectionName: string, data: Record<string, unknown>, isJson: boolean): ValidationResult {
    const checks = sectionChecks[sectionName];
    const coveredFields = new Set<string>();
    let isValid = true;

    if (checks) {
      for (const [field, value] of Object.entries(data)) {
        const normalizedField = isJson ? kebabToCamelCase(field, this.kebabToCamelCache) : field;
        
        if (checks.has(normalizedField)) {
          coveredFields.add(normalizedField);
          isValid = this.validateField(normalizedField, value, isJson) && isValid;
        } else {
          console.warn(`  Warning: Unexpected field '${normalizedField}' in '${sectionName}' section.`);
          isValid = false;
        }
      }

      const { coveragePercentage, missingFields } = this.calculateCoverage(coveredFields, checks);
      console.log(`  ${sectionName} coverage: ${coveragePercentage.toFixed(2)}% (${coveredFields.size}/${checks.size} fields)`);
      if (missingFields.length > 0) {
        console.log(`  Missing fields in '${sectionName}' section: ${missingFields.join(', ')}`);
      }

      return { isValid, coveragePercentage, missingFields };
    }

    return { isValid: true, coveragePercentage: 100, missingFields: [] };
  }

  private calculateCoverage(coveredFields: Set<string>, expectedFields: Set<string>): { coveragePercentage: number, missingFields: string[] } {
    const missingFields = Array.from(expectedFields).filter(field => !coveredFields.has(field));
    const coveragePercentage = (coveredFields.size / expectedFields.size) * 100;
    return { coveragePercentage, missingFields };
  }
}