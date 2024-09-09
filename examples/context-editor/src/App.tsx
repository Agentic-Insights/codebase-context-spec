import React, { useState } from 'react';
import { Container, Paper, Modal, Box, Button, Typography, Tabs, Tab, Link as MuiLink, Tooltip, IconButton, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import theme from './theme';
import ContextForm from './components/ContextForm';
import ContextDocsForm from './components/ContextDocsForm';
import ContextIgnoreForm from './components/ContextIgnoreForm';
import './App.css';

// Conditional base path for GitHub Pages
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/codebase-context-spec' : '';

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFormSubmit = (content: string) => {
    setGeneratedContent(content);
  };

  const handleOpenPreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent).then(() => {
      setSnackbarMessage('Copied to clipboard!');
      setSnackbarOpen(true);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'generated_context.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbarMessage('File downloaded!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router basename={BASE_PATH}>
        <Container className="container" maxWidth="md">
          <Paper className="paper" elevation={3}>
            <Box className="header">
              <Typography className="title" variant="h4" component="h1">
                Codebase Context Editor
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              This editor helps you create .context.md, .contextdocs.md, and .contextignore files for your project.
            </Typography>
            <Typography variant="body1" paragraph>
              GitHub Repository:{' '}
              <MuiLink href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                https://github.com/Agentic-Insights/codebase-context-spec
              </MuiLink>
            </Typography>
            <NavTabs />
            <Box className="form-section">
              <Routes>
                <Route path="/" element={<ContextForm onSubmit={handleFormSubmit} />} />
                <Route path="/contextdocs" element={<ContextDocsForm onSubmit={handleFormSubmit} />} />
                <Route path="/contextignore" element={<ContextIgnoreForm onSubmit={handleFormSubmit} />} />
              </Routes>
            </Box>
            <Box className="action-buttons">
              <Tooltip title="Preview generated content" arrow>
                <Button
                  onClick={handleOpenPreview}
                  variant="contained"
                  startIcon={<PreviewIcon />}
                  disabled={!generatedContent}
                >
                  Preview
                </Button>
              </Tooltip>
              <Tooltip title="Copy to clipboard" arrow>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  disabled={!generatedContent}
                >
                  Copy
                </Button>
              </Tooltip>
              <Tooltip title="Download file" arrow>
                <Button
                  onClick={handleDownload}
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  disabled={!generatedContent}
                >
                  Download
                </Button>
              </Tooltip>
            </Box>
          </Paper>

          <Modal
            open={previewOpen}
            onClose={handleClosePreview}
            aria-labelledby="preview-modal-title"
            aria-describedby="preview-modal-description"
          >
            <Box className="modal-content">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography id="preview-modal-title" variant="h6" component="h2">
                  Preview of generated content
                </Typography>
                <IconButton onClick={handleClosePreview} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box className="code-preview">
                <pre>
                  {generatedContent}
                </pre>
              </Box>
            </Box>
          </Modal>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
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
