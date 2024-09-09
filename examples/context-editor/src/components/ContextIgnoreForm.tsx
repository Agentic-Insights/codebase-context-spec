import React, { useState } from 'react';
import { Button, Box, TextField, IconButton, Typography, Checkbox, FormControlLabel, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ContextIgnoreFormProps {
  onSubmit: (content: string) => void;
}

interface IgnoreRule {
  pattern: string;
  comment: string;
  isActive: boolean;
}

const ContextIgnoreForm: React.FC<ContextIgnoreFormProps> = ({ onSubmit }) => {
  const [ignoreRules, setIgnoreRules] = useState<IgnoreRule[]>([
    { pattern: 'node_modules/', comment: 'Ignore node_modules directory', isActive: true },
    { pattern: 'dist/', comment: 'Ignore build output', isActive: true },
    { pattern: '.env', comment: 'Ignore environment-specific files', isActive: true },
    { pattern: '*.log', comment: 'Ignore log files', isActive: true },
    { pattern: '.vscode/', comment: 'Ignore IDE-specific files', isActive: true },
    { pattern: '.DS_Store', comment: 'Ignore operating system files', isActive: true },
    { pattern: 'package-lock.json', comment: 'Ignore package manager lock files', isActive: true },
    { pattern: '*.zip', comment: 'Ignore large binary files', isActive: true },
    { pattern: '*.tmp', comment: 'Ignore temporary files', isActive: true },
  ]);

  const handleChange = (index: number, field: keyof IgnoreRule, value: string | boolean) => {
    const updatedRules = [...ignoreRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setIgnoreRules(updatedRules);
  };

  const addIgnoreRule = () => {
    setIgnoreRules([...ignoreRules, { pattern: '', comment: '', isActive: true }]);
  };

  const removeIgnoreRule = (index: number) => {
    const updatedRules = ignoreRules.filter((_, i) => i !== index);
    setIgnoreRules(updatedRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = generateContextIgnore();
    onSubmit(content);
  };

  const generateContextIgnore = () => {
    let content = '';
    ignoreRules.forEach((rule) => {
      if (rule.isActive) {
        if (rule.comment) {
          content += `# ${rule.comment}\n`;
        }
        content += `${rule.pattern}\n\n`;
      }
    });
    return content.trim();
  };

  return (
    <form onSubmit={handleSubmit}>
      {ignoreRules.map((rule, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1">Ignore Rule {index + 1}</Typography>
          <TextField
            fullWidth
            label="Pattern"
            value={rule.pattern}
            onChange={(e) => handleChange(index, 'pattern', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Comment"
            value={rule.comment}
            onChange={(e) => handleChange(index, 'comment', e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rule.isActive}
                onChange={(e) => handleChange(index, 'isActive', e.target.checked)}
              />
            }
            label="Active"
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => removeIgnoreRule(index)} startIcon={<DeleteIcon />} color="secondary">
              Remove Rule
            </Button>
          </Box>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} onClick={addIgnoreRule} sx={{ mb: 2 }}>
        Add Ignore Rule
      </Button>
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Generate .contextignore
        </Button>
      </Box>
    </form>
  );
};

export default ContextIgnoreForm;