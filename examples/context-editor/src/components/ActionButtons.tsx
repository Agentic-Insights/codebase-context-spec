import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

interface ActionButtonsProps {
  generatedContent: string;
  onCopy: () => void;
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ generatedContent, onCopy, onDownload }) => {
  return (
    <Box className="action-buttons">
      <Tooltip title="Copy to clipboard" arrow>
        <span>
          <Button
            onClick={onCopy}
            variant="contained"
            startIcon={<ContentCopyIcon />}
            disabled={!generatedContent}
          >
            Copy
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Download file" arrow>
        <span>
          <Button
            onClick={onDownload}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!generatedContent}
          >
            Download
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ActionButtons;