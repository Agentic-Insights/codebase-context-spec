import React from 'react';
import { Grid, TextField } from '@mui/material';

interface MetadataSectionProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ formData, errors, handleChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Module Name"
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
          required
          error={!!errors.moduleName}
          helperText={errors.moduleName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Related Modules"
          name="relatedModules"
          value={formData.relatedModules}
          onChange={handleChange}
          helperText="Comma-separated list"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          required
          error={!!errors.version}
          helperText={errors.version || 'Use semantic versioning (e.g., 1.0.0)'}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          required
          error={!!errors.description}
          helperText={errors.description}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Diagrams"
          name="diagrams"
          value={formData.diagrams}
          onChange={handleChange}
          helperText="Comma-separated list of diagram file paths or URLs"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          helperText="Comma-separated list"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Conventions"
          name="conventions"
          value={formData.conventions}
          onChange={handleChange}
          multiline
          rows={3}
          helperText="One convention per line"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Directives"
          name="directives"
          value={formData.directives}
          onChange={handleChange}
          multiline
          rows={3}
          helperText="One directive per line"
        />
      </Grid>
    </Grid>
  );
};

export default MetadataSection;