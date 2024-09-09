import React, { useState } from 'react';
import { Button, Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ContextDocsFormProps {
  onSubmit: (content: string) => void;
}

interface DocumentationBundle {
  name: string;
  relationship: string;
  resources: Array<{ [key: string]: string }>;
}

const ContextDocsForm: React.FC<ContextDocsFormProps> = ({ onSubmit }) => {
  const [documentationBundles, setDocumentationBundles] = useState<DocumentationBundle[]>([
    { name: '', relationship: '', resources: [] }
  ]);

  const handleChange = (index: number, field: keyof DocumentationBundle, value: string) => {
    const updatedBundles = [...documentationBundles];
    updatedBundles[index] = { ...updatedBundles[index], [field]: value };
    setDocumentationBundles(updatedBundles);
  };

  const handleResourceChange = (bundleIndex: number, resourceIndex: number, key: string, value: string) => {
    const updatedBundles = [...documentationBundles];
    const resources = [...updatedBundles[bundleIndex].resources];
    resources[resourceIndex] = { [key]: value };
    updatedBundles[bundleIndex] = {
      ...updatedBundles[bundleIndex],
      resources: resources
    };
    setDocumentationBundles(updatedBundles);
  };

  const addDocumentationBundle = () => {
    setDocumentationBundles([...documentationBundles, { name: '', relationship: '', resources: [] }]);
  };

  const removeDocumentationBundle = (index: number) => {
    const updatedBundles = documentationBundles.filter((_, i) => i !== index);
    setDocumentationBundles(updatedBundles);
  };

  const addResource = (index: number) => {
    const updatedBundles = [...documentationBundles];
    updatedBundles[index] = {
      ...updatedBundles[index],
      resources: [...updatedBundles[index].resources, { '': '' }]
    };
    setDocumentationBundles(updatedBundles);
  };

  const removeResource = (bundleIndex: number, resourceIndex: number) => {
    const updatedBundles = [...documentationBundles];
    updatedBundles[bundleIndex].resources = updatedBundles[bundleIndex].resources.filter((_, i) => i !== resourceIndex);
    setDocumentationBundles(updatedBundles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = generateContextDocsMd();
    onSubmit(content);
  };

  const generateContextDocsMd = () => {
    let content = '---\ncontextdocs:\n';
    const nonEmptyBundles = documentationBundles.filter(bundle => bundle.name || bundle.relationship || bundle.resources.length > 0);
    nonEmptyBundles.forEach((bundle) => {
      if (bundle.name || bundle.relationship || bundle.resources.length > 0) {
        content += `  - name: ${bundle.name}\n`;
        content += `    relationship: ${bundle.relationship}\n`;
        const nonEmptyResources = bundle.resources.filter(resource => Object.keys(resource)[0] && Object.values(resource)[0]);
        if (nonEmptyResources.length > 0) {
          content += '    resources:\n';
          nonEmptyResources.forEach((resource) => {
            const [key, value] = Object.entries(resource)[0];
            content += `      - ${key}: ${value}\n`;
          });
        }
      }
    });
    content += '---\n\n';
    content += '# Additional Documentation Notes\n\n';
    content += 'This section can include any free-form text to provide context about the listed documentation bundles, ';
    content += 'their relevance to the project, or any other pertinent information.';
    return content;
  };

  return (
    <form onSubmit={handleSubmit}>
      {documentationBundles.map((bundle, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 4, p: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6">Documentation Bundle {index + 1}</Typography>
          <TextField
            fullWidth
            label="Name"
            value={bundle.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Relationship"
            value={bundle.relationship}
            onChange={(e) => handleChange(index, 'relationship', e.target.value)}
            margin="normal"
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Resources</Typography>
          {bundle.resources.map((resource, resourceIndex) => {
            const [key, value] = Object.entries(resource)[0];
            return (
              <Box key={resourceIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Resource Name"
                  value={key}
                  onChange={(e) => handleResourceChange(index, resourceIndex, e.target.value, value)}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <TextField
                  label="URL"
                  value={value}
                  onChange={(e) => handleResourceChange(index, resourceIndex, key, e.target.value)}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <IconButton onClick={() => removeResource(index, resourceIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button startIcon={<AddIcon />} onClick={() => addResource(index)} sx={{ mt: 1 }}>
            Add Resource
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => removeDocumentationBundle(index)} startIcon={<DeleteIcon />} color="secondary">
              Remove Documentation Bundle
            </Button>
          </Box>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} onClick={addDocumentationBundle} sx={{ mb: 2 }}>
        Add Documentation Bundle
      </Button>
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Generate .contextdocs.md
        </Button>
      </Box>
    </form>
  );
};

export default ContextDocsForm;