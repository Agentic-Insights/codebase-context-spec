import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          console.log('Imported file content:', content);
          const parsedData = parseContextMd(content);
          console.log('Parsed data:', parsedData);
          setFormData(parsedData);
        } catch (error) {
          console.error('Error parsing imported file:', error);
          // You might want to show an error message to the user here
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        // You might want to show an error message to the user here
      };
      reader.readAsText(file);
    }
  };

  const parseContextMd = (content: string): FormDataType => {
    const lines = content.split('\n');
    const parsedData: FormDataType = JSON.parse(JSON.stringify(formData));

    let currentSection: keyof FormDataType | 'metadata' | null = null;
    let nestedSection: string | null = null;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        currentSection = line.substring(2).trim().toLowerCase() as keyof FormDataType | 'metadata';
        nestedSection = null;
      } else if (line.startsWith('## ')) {
        nestedSection = line.substring(3).trim().toLowerCase();
      } else if (line.startsWith('- ')) {
        const [key, ...valueParts] = line.substring(2).split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
          if (currentSection === 'metadata') {
            const metadataKey = key.replace(/\s+/g, '') as keyof FormDataType;
            if (metadataKey === 'relatedModules' || metadataKey === 'diagrams' || metadataKey === 'technologies') {
              (parsedData[metadataKey] as string[]) = value.split(',').map((s) => s.trim());
            } else if (metadataKey in parsedData) {
              (parsedData[metadataKey] as string) = value;
            }
          } else if (currentSection && currentSection in parsedData && typeof parsedData[currentSection] === 'object') {
            const sectionData = parsedData[currentSection] as Record<string, unknown>;
            if (nestedSection) {
              if (!(nestedSection in sectionData)) {
                sectionData[nestedSection] = {};
              }
              (sectionData[nestedSection] as Record<string, string>)[key] = value;
            } else {
              (sectionData as Record<string, string>)[key] = value;
            }
          }
        }
      }
    });

    return parsedData;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          accept=".md"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileImport}
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          Import .context.md
        </Button>
      </Box>

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