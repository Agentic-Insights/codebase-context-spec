import React from 'react';
import { Grid2, TextField, Chip, Autocomplete } from '@mui/material';
import { FormDataType } from './ContextForm';

interface MetadataSectionProps {
  formData: FormDataType;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMultiChange: (field: string) => (event: React.SyntheticEvent, value: string[]) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ formData, errors, handleChange, handleMultiChange }) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <TextField
          fullWidth
          label="Module Name"
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
          error={!!errors.moduleName}
          helperText={errors.moduleName || 'Optional: Name of the module'}
        />
      </Grid2>
      <Grid2 size={12}>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formData.relatedModules}
          onChange={handleMultiChange('relatedModules')}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Related Modules"
              placeholder="Add module"
              helperText="Optional: Add related modules"
            />
          )}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          error={!!errors.version}
          helperText={errors.version || 'Optional: Use semantic versioning (e.g., 1.0.0)'}
        />
      </Grid2>
      <Grid2 size={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description || 'Optional: Brief description of the module'}
        />
      </Grid2>
      <Grid2 size={12}>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formData.diagrams}
          onChange={handleMultiChange('diagrams')}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Diagrams"
              placeholder="Add diagram"
              helperText="Optional: Add diagram file paths or URLs"
            />
          )}
        />
      </Grid2>
      <Grid2 size={12}>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formData.technologies}
          onChange={handleMultiChange('technologies')}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Technologies"
              placeholder="Add technology"
              helperText="Optional: Add technologies used"
            />
          )}
        />
      </Grid2>
      <Grid2 size={12}>
        <TextField
          fullWidth
          label="Conventions"
          name="conventions"
          value={formData.conventions}
          onChange={handleChange}
          multiline
          rows={3}
          helperText="Optional: One convention per line"
        />
      </Grid2>
      <Grid2 size={12}>
        <TextField
          fullWidth
          label="Directives"
          name="directives"
          value={formData.directives}
          onChange={handleChange}
          multiline
          rows={3}
          helperText="Optional: One directive per line"
        />
      </Grid2>
    </Grid2>
  );
};

export default MetadataSection;