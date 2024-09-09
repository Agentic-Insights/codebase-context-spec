import React, { useState } from 'react';
import { Container, Paper, Modal, Box, Button, Typography, Tabs, Tab, Link as MuiLink } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import theme from './theme';
import ContextForm from './components/ContextForm';
import ContextDocsForm from './components/ContextDocsForm';
import ContextIgnoreForm from './components/ContextIgnoreForm';

// Conditional base path for GitHub Pages
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/codebase-context-spec' : '';

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
      <Router basename={BASE_PATH}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Codebase Context Editor
              </Typography>
              <Typography variant="body1" paragraph>
                This editor helps you create .context.md, .contextdocs.md, and .contextignore files for your project.
              </Typography>
              <Typography variant="body1" paragraph>
                GitHub Repository:{' '}
                <MuiLink href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                  https://github.com/Agentic-Insights/codebase-context-spec
                </MuiLink>
              </Typography>
            </Box>
            <NavTabs />
            <Routes>
              <Route path="/" element={<ContextForm onSubmit={handleFormSubmit} />} />
              <Route path="/contextdocs" element={<ContextDocsForm onSubmit={handleFormSubmit} />} />
              <Route path="/contextignore" element={<ContextIgnoreForm onSubmit={handleFormSubmit} />} />
            </Routes>
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
                Generated File Preview
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
      </Router>
    </ThemeProvider>
  );
};

const NavTabs: React.FC = () => {
  const location = useLocation();
  const currentForm = getCurrentForm(location.pathname);

  return (
    <Tabs value={currentForm} aria-label="file type tabs">
      <Tab icon={<DescriptionIcon />} label=".context.md" component={Link} to="/" />
      <Tab icon={<LibraryBooksIcon />} label=".contextdocs.md" component={Link} to="/contextdocs" />
      <Tab icon={<BlockIcon />} label=".contextignore" component={Link} to="/contextignore" />
    </Tabs>
  );
};

const getCurrentForm = (pathname: string) => {
  switch (pathname) {
    case '/contextdocs':
      return 1;
    case '/contextignore':
      return 2;
    default:
      return 0;
  }
};

export default App;
