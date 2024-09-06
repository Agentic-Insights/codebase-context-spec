import React from 'react';
import { Grid, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface ArchitectureSectionProps {
  formData: FormDataType;
  handleNestedChange: (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ formData, handleNestedChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Architecture</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Style"
              name="architecture.style"
              value={formData.architecture.style}
              onChange={handleNestedChange('architecture', 'style')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Components"
              name="architecture.components"
              value={formData.architecture.components}
              onChange={handleNestedChange('architecture', 'components')}
              multiline
              rows={3}
              helperText="One component per line"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Data Flow"
              name="architecture.dataFlow"
              value={formData.architecture.dataFlow}
              onChange={handleNestedChange('architecture', 'dataFlow')}
              multiline
              rows={3}
              helperText="One data flow step per line"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ArchitectureSection;