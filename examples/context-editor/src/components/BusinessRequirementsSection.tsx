import React from 'react';
import { Grid2, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface BusinessRequirementsSectionProps {
  formData: FormDataType;
  handleNestedChange: (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BusinessRequirementsSection: React.FC<BusinessRequirementsSectionProps> = ({ formData, handleNestedChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Business Requirements</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Key Features"
              name="businessRequirements.keyFeatures"
              value={formData.businessRequirements.keyFeatures}
              onChange={handleNestedChange('businessRequirements', 'keyFeatures')}
              multiline
              rows={3}
              helperText="Optional: One feature per line"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Target Audience"
              name="businessRequirements.targetAudience"
              value={formData.businessRequirements.targetAudience}
              onChange={handleNestedChange('businessRequirements', 'targetAudience')}
              helperText="Optional: Describe the target audience"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Success Metrics"
              name="businessRequirements.successMetrics"
              value={formData.businessRequirements.successMetrics}
              onChange={handleNestedChange('businessRequirements', 'successMetrics')}
              multiline
              rows={3}
              helperText="Optional: One metric per line"
            />
          </Grid2>
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default BusinessRequirementsSection;