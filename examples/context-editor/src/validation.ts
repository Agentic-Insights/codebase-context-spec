interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate version format (e.g., semantic versioning) if provided
  const versionRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/;
  if (formData.version && !versionRegex.test(formData.version)) {
    errors.version = 'Invalid version format. Use semantic versioning (e.g., 1.0.0)';
  }

  // Validate coverage threshold if provided
  if (formData.qualityAssurance.coverageThreshold) {
    const coverageThreshold = parseInt(formData.qualityAssurance.coverageThreshold);
    if (isNaN(coverageThreshold) || coverageThreshold < 0 || coverageThreshold > 100) {
      errors['qualityAssurance.coverageThreshold'] = 'Coverage threshold must be a number between 0 and 100';
    }
  }

  return errors;
};

export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};