import React from 'react';
import { Grid2, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface DevelopmentSectionProps {
  formData: FormDataType;
  handleNestedChange: (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DevelopmentSection: React.FC<DevelopmentSectionProps> = ({ formData, handleNestedChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Development</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Setup Steps"
              name="development.setupSteps"
              value={formData.development.setupSteps}
              onChange={handleNestedChange('development', 'setupSteps')}
              multiline
              rows={3}
              helperText="Optional: One setup step per line"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Build Command"
              name="development.buildCommand"
              value={formData.development.buildCommand}
              onChange={handleNestedChange('development', 'buildCommand')}
              helperText="Optional: Command to build the project"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Test Command"
              name="development.testCommand"
              value={formData.development.testCommand}
              onChange={handleNestedChange('development', 'testCommand')}
              helperText="Optional: Command to run tests"
            />
          </Grid2>
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default DevelopmentSection;