import React, { useState } from 'react';
import { Container, Paper, Modal, Box, Button, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Header from './components/Header';
import ContextForm from './components/ContextForm';

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleFormSubmit = (content: string) => {
    setGeneratedContent(content);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Header />
          <ContextForm onSubmit={handleFormSubmit} />
        </Paper>

        <Modal
          open={previewOpen}
          onClose={handleClosePreview}
          aria-labelledby="preview-modal-title"
          aria-describedby="preview-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <Typography id="preview-modal-title" variant="h6" component="h2" gutterBottom>
              Generated .context.md Preview
            </Typography>
            <Paper sx={{ p: 2, maxHeight: 'calc(80vh - 100px)', overflow: 'auto' }}>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {generatedContent}
              </pre>
            </Paper>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClosePreview} variant="contained">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default App;
