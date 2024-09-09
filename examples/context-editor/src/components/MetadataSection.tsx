import React, { useState } from 'react';
import { Grid2, TextField, Chip, Autocomplete, Button, Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormDataType } from './ContextForm';

interface MetadataSectionProps {
  formData: FormDataType;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMultiChange: (field: string) => (value: any) => void;
}

interface NamePathPair {
  name: string;
  path: string;
}

const NamePathInput: React.FC<{
  label: string;
  items: NamePathPair[];
  onAdd: (item: NamePathPair) => void;
  onRemove: (index: number) => void;
  validatePath: (path: string) => string | null;
}> = ({ label, items, onAdd, onRemove, validatePath }) => {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const validationError = validatePath(path);
    if (validationError) {
      setError(validationError);
    } else if (name && path) {
      onAdd({ name, path });
      setName('');
      setPath('');
      setError(null);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={`${label} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label={`${label} Path`}
        value={path}
        onChange={(e) => setPath(e.target.value)}
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
      />
      <Button onClick={handleAdd} variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
        Add {label}
      </Button>
      <Box sx={{ mt: 1 }}>
        {items.map((item, index) => (
          <Chip
            key={index}
            label={`${item.name} (${item.path})`}
            onDelete={() => onRemove(index)}
            style={{ margin: '4px' }}
          />
        ))}
      </Box>
    </Box>
  );
};

const validateRelativeModulePath = (path: string): string | null => {
  if (!path.startsWith('./') && !path.startsWith('../')) {
    return 'Path must be a relative path (start with ./ or ../)';
  }
  if (path.endsWith('/')) {
    return 'Path must not end with a slash';
  }
  return null;
};

const validateDiagramPath = (path: string): string | null => {
  const allowedExtensions = ['.mermaid', '.mmd', '.pdf', '.png', '.jpg', '.jpeg'];
  const extension = path.substring(path.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return `File must be one of: ${allowedExtensions.join(', ')}`;
  }
  return null;
};

const MetadataSection: React.FC<MetadataSectionProps> = ({ formData, errors, handleChange, handleMultiChange }) => {
  const handleAddRelatedModule = (item: NamePathPair) => {
    handleMultiChange('relatedModules')([...formData.relatedModules, item]);
  };

  const handleRemoveRelatedModule = (index: number) => {
    handleMultiChange('relatedModules')(formData.relatedModules.filter((_, i) => i !== index));
  };

  const handleAddDiagram = (item: NamePathPair) => {
    handleMultiChange('diagrams')([...formData.diagrams, item]);
  };

  const handleRemoveDiagram = (index: number) => {
    handleMultiChange('diagrams')(formData.diagrams.filter((_, i) => i !== index));
  };

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
        <Divider sx={{ my: 2 }} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Related Modules</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NamePathInput
              label="Related Module"
              items={formData.relatedModules}
              onAdd={handleAddRelatedModule}
              onRemove={handleRemoveRelatedModule}
              validatePath={validateRelativeModulePath}
            />
          </AccordionDetails>
        </Accordion>
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
        <Divider sx={{ my: 2 }} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Diagrams</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NamePathInput
              label="Diagram"
              items={formData.diagrams}
              onAdd={handleAddDiagram}
              onRemove={handleRemoveDiagram}
              validatePath={validateDiagramPath}
            />
          </AccordionDetails>
        </Accordion>
      </Grid2>
      <Grid2 size={12}>
        <Divider sx={{ my: 2 }} />
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formData.technologies}
          onChange={(_, value) => handleMultiChange('technologies')(value)}
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