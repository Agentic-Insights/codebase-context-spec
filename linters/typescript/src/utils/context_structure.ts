export const allowedTopLevelFields: Set<string> = new Set([
  'module-name',
  'related-modules',
  'version',
  'description',
  'diagrams',
  'technologies',
  'conventions',
  'directives',
  'architecture',
  'development',
  'business-requirements',
  'quality-assurance',
  'deployment'
]);

export const sectionChecks: Record<string, Set<string>> = {
  architecture: new Set(['style', 'components', 'data-flow']),
  development: new Set(['setup-steps', 'build-command', 'test-command']),
  'business-requirements': new Set(['key-features', 'target-audience', 'success-metrics']),
  'quality-assurance': new Set(['testing-frameworks', 'coverage-threshold', 'performance-benchmarks']),
  deployment: new Set(['platform', 'cicd-pipeline', 'staging-environment', 'production-environment'])
};

export const listTypes: Set<string> = new Set([
  'related-modules',
  'diagrams',
  'technologies',
  'conventions',
  'directives',
  'components',
  'data-flow',
  'setup-steps',
  'key-features',
  'success-metrics',
  'testing-frameworks',
  'performance-benchmarks'
]);

export const stringTypes: Set<string> = new Set([
  'module-name',
  'version',
  'description',
  'style',
  'build-command',
  'test-command',
  'target-audience',
  'coverage-threshold',
  'platform',
  'cicd-pipeline',
  'staging-environment',
  'production-environment'
]);

export const directoryTypes: Set<string> = new Set([
  'related-modules'
]);