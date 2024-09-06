import React, { useState } from 'react';
import { Button, Box, Alert } from '@mui/material';
import MetadataSection from './MetadataSection';
import ArchitectureSection from './ArchitectureSection';
import DevelopmentSection from './DevelopmentSection';
import BusinessRequirementsSection from './BusinessRequirementsSection';
import QualityAssuranceSection from './QualityAssuranceSection';
import DeploymentSection from './DeploymentSection';
import MarkdownContentSection from './MarkdownContentSection';
import { validateForm, isFormValid } from '../validation';
import { generateContextMd } from '../generateContextMd';

interface ContextFormProps {
  onSubmit: (content: string) => void;
}

export type FormDataType = {
  moduleName: string;
  relatedModules: string;
  version: string;
  description: string;
  diagrams: string;
  technologies: string;
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
};

const ContextForm: React.FC<ContextFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormDataType>({
    moduleName: '',
    relatedModules: '',
    version: '',
    description: '',
    diagrams: '',
    technologies: '',
    conventions: '',
    directives: '',
    architecture: {
      style: '',
      components: '',
      dataFlow: '',
    },
    development: {
      setupSteps: '',
      buildCommand: '',
      testCommand: '',
    },
    businessRequirements: {
      keyFeatures: '',
      targetAudience: '',
      successMetrics: '',
    },
    qualityAssurance: {
      testingFrameworks: '',
      coverageThreshold: '',
      performanceBenchmarks: '',
    },
    deployment: {
      platform: '',
      cicdPipeline: '',
      stagingEnvironment: '',
      productionEnvironment: '',
    },
    markdownContent: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...(prevData[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (isFormValid(validationErrors)) {
      const content = generateContextMd(formData);
      onSubmit(content);
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MetadataSection formData={formData} errors={errors} handleChange={handleChange} />
      <ArchitectureSection formData={formData} handleNestedChange={handleNestedChange} />
      <DevelopmentSection formData={formData} handleNestedChange={handleNestedChange} />
      <BusinessRequirementsSection formData={formData} handleNestedChange={handleNestedChange} />
      <QualityAssuranceSection formData={formData} errors={errors} handleNestedChange={handleNestedChange} />
      <DeploymentSection formData={formData} handleNestedChange={handleNestedChange} />
      <MarkdownContentSection formData={formData} errors={errors} handleChange={handleChange} />

      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Generate .context.md
        </Button>
      </Box>

      {!isFormValid(errors) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please correct the errors in the form before submitting.
        </Alert>
      )}
    </form>
  );
};

export default ContextForm;