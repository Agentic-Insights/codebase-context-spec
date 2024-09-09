import React, { useState } from 'react';
import { Button, Box, TextField, IconButton, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ContextDocsFormProps {
  onSubmit: (content: string) => void;
}

interface ContextDoc {
  name: string;
  relationship: string;
  resources: { [key: string]: string };
}

const ContextDocsForm: React.FC<ContextDocsFormProps> = ({ onSubmit }) => {
  const [contextDocs, setContextDocs] = useState<ContextDoc[]>([
    { name: '', relationship: '', resources: {} }
  ]);

  const handleChange = (index: number, field: keyof ContextDoc, value: string) => {
    const updatedDocs = [...contextDocs];
    updatedDocs[index] = { ...updatedDocs[index], [field]: value };
    setContextDocs(updatedDocs);
  };

  const handleResourceChange = (index: number, oldKey: string, newKey: string, value: string) => {
    const updatedDocs = [...contextDocs];
    const resources = { ...updatedDocs[index].resources };
    
    // Remove the old key-value pair
    delete resources[oldKey];
    
    // Add the new key-value pair
    if (newKey !== '' || value !== '') {
      resources[newKey] = value;
    }
    
    updatedDocs[index] = {
      ...updatedDocs[index],
      resources: resources
    };
    setContextDocs(updatedDocs);
  };

  const addContextDoc = () => {
    setContextDocs([...contextDocs, { name: '', relationship: '', resources: {} }]);
  };

  const removeContextDoc = (index: number) => {
    const updatedDocs = contextDocs.filter((_, i) => i !== index);
    setContextDocs(updatedDocs);
  };

  const addResource = (index: number) => {
    const updatedDocs = [...contextDocs];
    updatedDocs[index] = {
      ...updatedDocs[index],
      resources: { ...updatedDocs[index].resources, '': '' }
    };
    setContextDocs(updatedDocs);
  };

  const removeResource = (docIndex: number, resourceKey: string) => {
    const updatedDocs = [...contextDocs];
    const { [resourceKey]: _, ...remainingResources } = updatedDocs[docIndex].resources;
    updatedDocs[docIndex] = { ...updatedDocs[docIndex], resources: remainingResources };
    setContextDocs(updatedDocs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = generateContextDocsMd();
    onSubmit(content);
  };

  const generateContextDocsMd = () => {
    let content = '---\ncontextdocs:\n';
    const nonEmptyDocs = contextDocs.filter(doc => doc.name || doc.relationship || Object.keys(doc.resources).length > 0);
    nonEmptyDocs.forEach((doc) => {
      if (doc.name || doc.relationship || Object.keys(doc.resources).length > 0) {
        content += `  - name: ${doc.name}\n`;
        content += `    relationship: ${doc.relationship}\n`;
        const nonEmptyResources = Object.entries(doc.resources).filter(([key, value]) => key && value);
        if (nonEmptyResources.length > 0) {
          content += '    resources:\n';
          nonEmptyResources.forEach(([key, value]) => {
            content += `      - ${key}: ${value}\n`;
          });
        }
      }
    });
    content += '---\n\n';
    content += 'This file contains a list of external dependencies and libraries used in the project. ';
    content += 'The YAML front-matter above provides structured data about each bundle, ';
    content += 'including its relationship to the project and links to relevant resources.';
    return content;
  };

  return (
    <form onSubmit={handleSubmit}>
      {contextDocs.map((doc, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 4, p: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6">Bundle {index + 1}</Typography>
          <TextField
            fullWidth
            label="Name"
            value={doc.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Relationship"
            value={doc.relationship}
            onChange={(e) => handleChange(index, 'relationship', e.target.value)}
            margin="normal"
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Resources</Typography>
          {Object.entries(doc.resources).map(([key, value], resourceIndex) => (
            <Box key={resourceIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Resource Name"
                value={key}
                onChange={(e) => handleResourceChange(index, key, e.target.value, value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <TextField
                label="URL"
                value={value}
                onChange={(e) => handleResourceChange(index, key, key, e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <IconButton onClick={() => removeResource(index, key)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={() => addResource(index)} sx={{ mt: 1 }}>
            Add Resource
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => removeContextDoc(index)} startIcon={<DeleteIcon />} color="secondary">
              Remove Bundle
            </Button>
          </Box>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} onClick={addContextDoc} sx={{ mb: 2 }}>
        Add Bundle
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