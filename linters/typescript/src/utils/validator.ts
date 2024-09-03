import { kebabToCamelCase } from './string_utils';
import { allowedTopLevelFields, sectionChecks, listTypes, stringTypes, directoryTypes } from './context_structure';

export class ContextValidator {
  private kebabToCamelCache: Map<string, string>;

  constructor() {
    this.kebabToCamelCache = new Map();
  }

  public validateContextData(data: Record<string, unknown>, format: 'markdown' | 'yaml' | 'json'): void {
    const isJson = format === 'json';
    const coveredFields = new Set<string>();
    
    for (const [field, value] of Object.entries(data)) {
      const normalizedField = isJson ? kebabToCamelCase(field, this.kebabToCamelCache) : field;
      
      if (allowedTopLevelFields.has(normalizedField)) {
        coveredFields.add(normalizedField);
        this.validateField(normalizedField, value, isJson);
      } else {
        console.warn(`  Warning: Unexpected top-level field '${normalizedField}'.`);
      }
    }

    const coveragePercentage = (coveredFields.size / allowedTopLevelFields.size) * 100;
    console.log(`  Context coverage: ${coveragePercentage.toFixed(2)}% (${coveredFields.size}/${allowedTopLevelFields.size} fields)`);

    for (const section of Object.keys(sectionChecks)) {
      if (section in data) {
        this.validateSectionFields(section, data[section] as Record<string, unknown>, isJson);
      }
    }
  }

  private validateField(field: string, value: unknown, isJson: boolean): void {
    if (listTypes.has(field) && !Array.isArray(value)) {
      console.error(`  Error: Field '${field}' should be an array.`);
    } else if (stringTypes.has(field) && typeof value !== 'string') {
      console.error(`  Error: Field '${field}' should be a string.`);
    } else if (directoryTypes.has(field)) {
      // Additional validation for directory types can be added here
    }
  }

  private validateSectionFields(sectionName: string, data: Record<string, unknown>, isJson: boolean): void {
    const checks = sectionChecks[sectionName];
    const coveredFields = new Set<string>();

    if (checks) {
      for (const [field, value] of Object.entries(data)) {
        const normalizedField = isJson ? kebabToCamelCase(field, this.kebabToCamelCache) : field;
        
        if (checks.has(normalizedField)) {
          coveredFields.add(normalizedField);
          this.validateField(normalizedField, value, isJson);
        } else {
          console.warn(`  Warning: Unexpected field '${normalizedField}' in '${sectionName}' section.`);
        }
      }

      const coveragePercentage = (coveredFields.size / checks.size) * 100;
      console.log(`  ${sectionName} coverage: ${coveragePercentage.toFixed(2)}% (${coveredFields.size}/${checks.size} fields)`);
    }
  }
}