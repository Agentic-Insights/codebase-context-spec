import React from 'react';
import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface SpecificationViewerProps {
  content: string;
  onCopy: () => void;
}

const SpecificationViewer: React.FC<SpecificationViewerProps> = ({ content, onCopy }) => {
  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button startIcon={<ContentCopyIcon />} onClick={onCopy}>
          Copy Specification
        </Button>
      </Box>
      <Box flexGrow={1} overflow="auto">
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
          {content}
        </pre>
      </Box>
    </Box>
  );
};

export default SpecificationViewer;