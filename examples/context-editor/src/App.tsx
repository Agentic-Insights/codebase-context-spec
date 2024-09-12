import React, { useState } from 'react';
import { Container, Paper, Box, Button, Typography, Link as MuiLink, Snackbar, IconButton, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import ContextForm from './components/ContextForm';
import ContextDocsForm from './components/ContextDocsForm';
import ContextIgnoreForm from './components/ContextIgnoreForm';
import PromptViewer from './components/PromptViewer';
import NavTabs from './components/NavTabs';
import SpecificationModal from './components/SpecificationModal';
import ActionButtons from './components/ActionButtons';
import { handleCopyToClipboard, handleDownload } from './utils/helpers';
import usePrompts from './hooks/usePrompts';
import useSnackbar from './hooks/useSnackbar';
import './App.css';

// Conditional base path for GitHub Pages
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/codebase-context-spec' : '';

const App: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [specModalOpen, setSpecModalOpen] = useState(false);

  const { snackbarOpen, snackbarMessage, showSnackbar, closeSnackbar } = useSnackbar();
  const { codebaseContext, generateContextPrompt, codingAssistantPrompt } = usePrompts(
    showSnackbar,
    (open: boolean) => open ? showSnackbar('') : closeSnackbar()
  );

  const handleFormSubmit = (content: string) => {
    setGeneratedContent(content);
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
                <Button 
                  className="viewLatestSpec" 
                  onClick={() => setSpecModalOpen(true)} 
                  sx={{ mr: 2 }}
                >
                  View Latest Specification v1.0.0-RFC
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
                      title="Generate Context Prompt" 
                      subtitle="GENERATE-CONTEXT-PROMPT.md"
                      explanation={generateContextPrompt.explanation}
                      content={generateContextPrompt.content} 
                      onCopy={() => handleCopyToClipboard(generateContextPrompt.content, showSnackbar, () => showSnackbar(''))} 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <PromptViewer 
                      title="Coding Assistant Prompt" 
                      subtitle="CODING-ASSISTANT-PROMPT.md"
                      explanation={codingAssistantPrompt.explanation}
                      content={codingAssistantPrompt.content} 
                      onCopy={() => handleCopyToClipboard(codingAssistantPrompt.content, showSnackbar, () => showSnackbar(''))} 
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
            <ActionButtons
              generatedContent={generatedContent}
              onCopy={() => handleCopyToClipboard(generatedContent, showSnackbar, () => showSnackbar(''))}
              onDownload={() => handleDownload(generatedContent, 'generated_context.md', showSnackbar, () => showSnackbar(''))}
            />
          </Paper>

          <SpecificationModal
            open={specModalOpen}
            onClose={() => setSpecModalOpen(false)}
            content={codebaseContext.content}
            onCopy={() => handleCopyToClipboard(codebaseContext.content, showSnackbar, () => showSnackbar(''))}
          />

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={closeSnackbar}
            message={snackbarMessage}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackbar}
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

export default App;
