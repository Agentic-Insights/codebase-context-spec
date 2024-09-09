import React from 'react';
import { Grid2, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface QualityAssuranceSectionProps {
  formData: FormDataType;
  errors: { [key: string]: string };
  handleNestedChange: (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const QualityAssuranceSection: React.FC<QualityAssuranceSectionProps> = ({ formData, errors, handleNestedChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Quality Assurance</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Testing Frameworks"
              name="qualityAssurance.testingFrameworks"
              value={formData.qualityAssurance.testingFrameworks}
              onChange={handleNestedChange('qualityAssurance', 'testingFrameworks')}
              helperText="Optional: Comma-separated list"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Coverage Threshold"
              name="qualityAssurance.coverageThreshold"
              value={formData.qualityAssurance.coverageThreshold}
              onChange={handleNestedChange('qualityAssurance', 'coverageThreshold')}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              error={!!errors['qualityAssurance.coverageThreshold']}
              helperText={errors['qualityAssurance.coverageThreshold'] || 'Optional: Percentage (0-100)'}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Performance Benchmarks"
              name="qualityAssurance.performanceBenchmarks"
              value={formData.qualityAssurance.performanceBenchmarks}
              onChange={handleNestedChange('qualityAssurance', 'performanceBenchmarks')}
              multiline
              rows={3}
              helperText="Optional: One benchmark per line"
            />
          </Grid2>
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default QualityAssuranceSection;