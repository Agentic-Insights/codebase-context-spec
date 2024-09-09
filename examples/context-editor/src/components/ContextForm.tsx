import React, { useState, useEffect } from 'react';
import { Button, Box, Alert, Paper } from '@mui/material';
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
  relatedModules: string[];
  version: string;
  description: string;
  diagrams: string[];
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
};

const ContextForm: React.FC<ContextFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormDataType>({
    moduleName: '',
    relatedModules: [],
    version: '',
    description: '',
    diagrams: [],
    technologies: [],
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

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

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

  const handleMultiChange = (field: string) => (event: React.SyntheticEvent, value: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
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
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <MetadataSection
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleMultiChange={handleMultiChange}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <ArchitectureSection formData={formData} handleNestedChange={handleNestedChange} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <DevelopmentSection formData={formData} handleNestedChange={handleNestedChange} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <BusinessRequirementsSection formData={formData} handleNestedChange={handleNestedChange} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <QualityAssuranceSection formData={formData} errors={errors} handleNestedChange={handleNestedChange} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <DeploymentSection formData={formData} handleNestedChange={handleNestedChange} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <MarkdownContentSection formData={formData} errors={errors} handleChange={handleChange} />
      </Paper>

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