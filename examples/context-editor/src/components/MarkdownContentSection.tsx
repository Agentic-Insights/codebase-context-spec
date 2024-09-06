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
      label="Markdown Content"
      name="markdownContent"
      value={formData.markdownContent}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={10}
      required
      error={!!errors.markdownContent}
      helperText={errors.markdownContent || 'Start with a title (H1 heading)'}
    />
  );
};

export default MarkdownContentSection;