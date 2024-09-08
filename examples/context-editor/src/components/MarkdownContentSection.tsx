import React from 'react';
import { TextField } from '@mui/material';

interface MarkdownContentSectionProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MarkdownContentSection: React.FC<MarkdownContentSectionProps> = ({ formData, errors, handleChange }) => {
  return (
    <TextField
      fullWidth
      label="Markdown Content (Optional)"
      name="markdownContent"
      value={formData.markdownContent}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={10}
      error={!!errors.markdownContent}
      helperText={errors.markdownContent || 'Add any additional markdown content here'}
    />
  );
};

export default MarkdownContentSection;