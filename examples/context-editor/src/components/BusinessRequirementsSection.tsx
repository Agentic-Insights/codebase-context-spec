import React from 'react';
import { Grid, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Key Features"
              name="businessRequirements.keyFeatures"
              value={formData.businessRequirements.keyFeatures}
              onChange={handleNestedChange('businessRequirements', 'keyFeatures')}
              multiline
              rows={3}
              helperText="One feature per line"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Target Audience"
              name="businessRequirements.targetAudience"
              value={formData.businessRequirements.targetAudience}
              onChange={handleNestedChange('businessRequirements', 'targetAudience')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Success Metrics"
              name="businessRequirements.successMetrics"
              value={formData.businessRequirements.successMetrics}
              onChange={handleNestedChange('businessRequirements', 'successMetrics')}
              multiline
              rows={3}
              helperText="One metric per line"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default BusinessRequirementsSection;