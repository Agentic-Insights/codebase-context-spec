import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Button, Typography, Tabs, Tab, Link as MuiLink, Tooltip, IconButton, Snackbar, Grid, Accordion, AccordionSummary, AccordionDetails, Modal } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import theme from './theme';
import ContextForm from './components/ContextForm';
import ContextDocsForm from './components/ContextDocsForm';
import ContextIgnoreForm from './components/ContextIgnoreForm';
import './App.css';

// Conditional base path for GitHub Pages
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/codebase-context-spec' : '';

const PromptViewer: React.FC<{ title: string, content: string, onCopy: () => void }> = ({ title, content, onCopy }) => {
  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">{title}</Typography>
        <Button startIcon={<ContentCopyIcon />} onClick={onCopy}>
          Copy
        </Button>
      </Box>
      <Box className="code-preview" style={{ maxHeight: '300px', overflow: 'auto' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content}
        </pre>
      </Box>
    </Box>
  );
};

const SpecificationViewer: React.FC<{ content: string, onCopy: () => void }> = ({ content, onCopy }) => {
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

const App: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [codebaseContextContent, setCodebaseContextContent] = useState('');
  const [codingAssistantPromptContent, setCodingAssistantPromptContent] = useState('');
  const [generateContextPromptContent, setGenerateContextPromptContent] = useState('');
  const [specModalOpen, setSpecModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const [codebaseContext, codingAssistantPrompt, generateContextPrompt] = await Promise.all([
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODEBASE-CONTEXT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODING-ASSISTANT-PROMPT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/GENERATE-CONTEXT-PROMPT.md').then(res => res.text())
        ]);

        setCodebaseContextContent(codebaseContext);
        setCodingAssistantPromptContent(codingAssistantPrompt);
        setGenerateContextPromptContent(generateContextPrompt);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setSnackbarMessage('Error fetching prompts');
        setSnackbarOpen(true);
      }
    };

    fetchPrompts();
  }, []);

  const handleFormSubmit = (content: string) => {
    setGeneratedContent(content);
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
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

  const handleOpenSpecModal = () => {
    setSpecModalOpen(true);
  };

  const handleCloseSpecModal = () => {
    setSpecModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router basename={BASE_PATH}>
        <Container className="container" maxWidth="lg">
          <Paper className="paper" elevation={3}>
            <Box className="header" display="flex" justifyContent="space-between" alignItems="center">
              <Typography className="title" variant="h4" component="h1">
                Codebase Context Editor
              </Typography>
              <Box display="flex" alignItems="center">
                <Button variant="outlined" onClick={handleOpenSpecModal} sx={{ mr: 2 }}>
                  View Latest Specification
                </Button>
                <MuiLink href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon fontSize="large" />
                </MuiLink>
              </Box>
            </Box>
            <Typography variant="body1" paragraph>
              This editor helps you create .context.md, .contextdocs.md, and .contextignore files for your project.
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>View Prompts</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <PromptViewer 
                      title="CODING-ASSISTANT-PROMPT.md" 
                      content={codingAssistantPromptContent} 
                      onCopy={() => handleCopyToClipboard(codingAssistantPromptContent)} 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <PromptViewer 
                      title="GENERATE-CONTEXT-PROMPT.md" 
                      content={generateContextPromptContent} 
                      onCopy={() => handleCopyToClipboard(generateContextPromptContent)} 
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <NavTabs />
            <Box className="form-section">
              <Routes>
                <Route path="/" element={<ContextForm onSubmit={handleFormSubmit} />} />
                <Route path="/contextdocs" element={<ContextDocsForm onSubmit={handleFormSubmit} />} />
                <Route path="/contextignore" element={<ContextIgnoreForm onSubmit={handleFormSubmit} />} />
              </Routes>
            </Box>
            <Box className="action-buttons">
              <Tooltip title="Copy to clipboard" arrow>
                <Button
                  onClick={() => handleCopyToClipboard(generatedContent)}
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
            open={specModalOpen}
            onClose={handleCloseSpecModal}
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
                <IconButton onClick={handleCloseSpecModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box flexGrow={1} overflow="hidden">
                <SpecificationViewer 
                  content={codebaseContextContent} 
                  onCopy={() => handleCopyToClipboard(codebaseContextContent)} 
                />
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
    <Tabs value={currentForm} aria-label="file type tabs" variant="fullWidth">
      <Tab 
        icon={<DescriptionIcon />} 
        label=".context.md" 
        component={Link} 
        to="/" 
        sx={{ textTransform: 'lowercase' }}
      />
      <Tab 
        icon={<LibraryBooksIcon />} 
        label=".contextdocs.md" 
        component={Link} 
        to="/contextdocs" 
        sx={{ textTransform: 'lowercase' }}
      />
      <Tab 
        icon={<BlockIcon />} 
        label=".contextignore" 
        component={Link} 
        to="/contextignore" 
        sx={{ textTransform: 'lowercase' }}
      />
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
