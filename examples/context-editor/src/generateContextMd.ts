import yaml from 'js-yaml';

interface FormData {
  moduleName: string;
  relatedModules: { name: string; path: string }[];
  version: string;
  description: string;
  diagrams: { name: string; path: string }[];
  technologies: string[];
  conventions: string;
  directives: string;
  architecture: {
    style: string;
    components: string;
    dataFlow: string;
  };
  development: {
    setupSteps: string;
    buildCommand: string;
    testCommand: string;
  };
  businessRequirements: {
    keyFeatures: string;
    targetAudience: string;
    successMetrics: string;
  };
  qualityAssurance: {
    testingFrameworks: string;
    coverageThreshold: string;
    performanceBenchmarks: string;
  };
  deployment: {
    platform: string;
    cicdPipeline: string;
    stagingEnvironment: string;
    productionEnvironment: string;
  };
  markdownContent: string;
}

const formatList = (input: string): string[] => {
  return input.split('\n').filter(item => item.trim() !== '');
};

const generateYamlFrontMatter = (data: FormData): string => {
  const frontMatterData = {
    'module-name': data.moduleName,
    'related-modules': data.relatedModules,
    version: data.version,
    description: data.description,
    diagrams: data.diagrams,
    technologies: data.technologies,
    conventions: formatList(data.conventions),
    directives: formatList(data.directives),
    architecture: {
      style: data.architecture.style,
      components: formatList(data.architecture.components),
      'data-flow': formatList(data.architecture.dataFlow),
    },
    development: {
      'setup-steps': formatList(data.development.setupSteps),
      'build-command': data.development.buildCommand,
      'test-command': data.development.testCommand,
    },
    'business-requirements': {
      'key-features': formatList(data.businessRequirements.keyFeatures),
      'target-audience': data.businessRequirements.targetAudience,
      'success-metrics': formatList(data.businessRequirements.successMetrics),
    },
    'quality-assurance': {
      'testing-frameworks': data.qualityAssurance.testingFrameworks.split(',').map(framework => framework.trim()),
      'coverage-threshold': `${data.qualityAssurance.coverageThreshold}%`,
      'performance-benchmarks': formatList(data.qualityAssurance.performanceBenchmarks),
    },
    deployment: {
      platform: data.deployment.platform,
      'cicd-pipeline': data.deployment.cicdPipeline,
      'staging-environment': data.deployment.stagingEnvironment,
      'production-environment': data.deployment.productionEnvironment,
    },
  };

  return yaml.dump(frontMatterData, { lineWidth: -1 });
};

export const generateContextMd = (formData: FormData): string => {
  const yamlFrontMatter = generateYamlFrontMatter(formData);
  const markdownContent = formData.markdownContent.trim();

  return `---\n${yamlFrontMatter}---\n\n${markdownContent}\n`;
};