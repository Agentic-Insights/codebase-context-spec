import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface PromptViewerProps {
  title: string;
  subtitle: string;
  explanation: string;
  content: string;
  onCopy: () => void;
}

const PromptViewer: React.FC<PromptViewerProps> = ({ title, subtitle, explanation, content, onCopy }) => {
  const isAllCaps = title === title.toUpperCase();

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Box>
          <Typography 
            variant={isAllCaps ? "body1" : "h6"} 
            sx={{ 
              fontWeight: 'bold',
              fontSize: isAllCaps ? '1rem' : 'inherit'
            }}
          >
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {explanation}
          </Typography>
        </Box>
        <Button startIcon={<ContentCopyIcon />} onClick={onCopy}>
          Copy
        </Button>
      </Box>
      <Box className="code-preview" sx={{ maxHeight: '300px', overflow: 'auto', marginTop: 2, backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
          {content}
        </pre>
      </Box>
    </Box>
  );
};

export default PromptViewer;