import React from 'react';
import { Grid2, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
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
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Style"
              name="architecture.style"
              value={formData.architecture.style}
              onChange={handleNestedChange('architecture', 'style')}
              helperText="Optional: Architectural style of the module"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Components"
              name="architecture.components"
              value={formData.architecture.components}
              onChange={handleNestedChange('architecture', 'components')}
              multiline
              rows={3}
              helperText="Optional: One component per line"
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Data Flow"
              name="architecture.dataFlow"
              value={formData.architecture.dataFlow}
              onChange={handleNestedChange('architecture', 'dataFlow')}
              multiline
              rows={3}
              helperText="Optional: One data flow step per line"
            />
          </Grid2>
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default ArchitectureSection;