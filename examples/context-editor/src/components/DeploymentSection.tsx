import React from 'react';
import { Grid, TextField, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface DeploymentSectionProps {
  formData: FormDataType;
  handleNestedChange: (section: keyof FormDataType, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DeploymentSection: React.FC<DeploymentSectionProps> = ({ formData, handleNestedChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Deployment</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Platform"
              name="deployment.platform"
              value={formData.deployment.platform}
              onChange={handleNestedChange('deployment', 'platform')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CI/CD Pipeline"
              name="deployment.cicdPipeline"
              value={formData.deployment.cicdPipeline}
              onChange={handleNestedChange('deployment', 'cicdPipeline')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Staging Environment"
              name="deployment.stagingEnvironment"
              value={formData.deployment.stagingEnvironment}
              onChange={handleNestedChange('deployment', 'stagingEnvironment')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Production Environment"
              name="deployment.productionEnvironment"
              value={formData.deployment.productionEnvironment}
              onChange={handleNestedChange('deployment', 'productionEnvironment')}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default DeploymentSection;