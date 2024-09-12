import React from 'react';
import { Box, Typography, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SpecificationViewer from './SpecificationViewer';

interface SpecificationModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  onCopy: () => void;
}

const SpecificationModal: React.FC<SpecificationModalProps> = ({ open, onClose, content, onCopy }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="spec-modal-title"
    >
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="spec-modal-title" variant="h6" component="h2">
            Latest Specification (CODEBASE-CONTEXT.md)
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box flexGrow={1} overflow="hidden">
          <SpecificationViewer 
            content={content} 
            onCopy={onCopy} 
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default SpecificationModal;