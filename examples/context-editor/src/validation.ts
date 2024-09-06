interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate required fields
  if (!formData.moduleName) {
    errors.moduleName = 'Module name is required';
  }

  if (!formData.version) {
    errors.version = 'Version is required';
  }

  if (!formData.description) {
    errors.description = 'Description is required';
  }

  // Validate version format (e.g., semantic versioning)
  const versionRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;
  if (formData.version && !versionRegex.test(formData.version)) {
    errors.version = 'Invalid version format. Use semantic versioning (e.g., 1.0.0)';
  }

  // Validate coverage threshold
  const coverageThreshold = parseInt(formData.qualityAssurance.coverageThreshold);
  if (isNaN(coverageThreshold) || coverageThreshold < 0 || coverageThreshold > 100) {
    errors['qualityAssurance.coverageThreshold'] = 'Coverage threshold must be a number between 0 and 100';
  }

  // Validate markdown content
  if (!formData.markdownContent.trim()) {
    errors.markdownContent = 'Markdown content is required';
  } else if (!formData.markdownContent.startsWith('# ')) {
    errors.markdownContent = 'Markdown content should start with a title (H1 heading)';
  }

  return errors;
};

export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};