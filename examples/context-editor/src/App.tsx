import React, { useState, useCallback } from 'react';
import { Container, Paper, Box, Typography, Link as MuiLink, Snackbar, IconButton, Accordion, AccordionSummary, AccordionDetails, Divider, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import theme from './theme';
import PromptViewer from './components/PromptViewer';
import SpecificationModal from './components/SpecificationModal';
import NavTabs from './components/NavTabs';
import ContextForm from './components/ContextForm';
import { handleCopyToClipboard } from './utils/helpers';
import usePrompts from './hooks/usePrompts';
import useSnackbar from './hooks/useSnackbar';
import './App.css';

const App: React.FC = () => {
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const { snackbarOpen, snackbarMessage, showSnackbar, closeSnackbar } = useSnackbar();
  const { codebaseContext, generateContextPrompt, codingAssistantPrompts } = usePrompts(
    showSnackbar,
    (open: boolean) => open ? showSnackbar('') : closeSnackbar()
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleContextFormSubmit = (content: string) => {
    console.log('Generated .context.md content:', content);
    showSnackbar('Context form submitted successfully');
    // Here you can add logic to save or process the generated content
  };

  const handleCopy = useCallback((content: string) => {
    handleCopyToClipboard(
      content,
      (message: string) => showSnackbar(message),
      (open: boolean) => open ? showSnackbar('') : closeSnackbar()
    );
  }, [showSnackbar, closeSnackbar]);

  return (
    <ThemeProvider theme={theme}>
      <Container className="container" maxWidth="lg">
        <Paper className="paper" elevation={3}>
          <Box className="header" display="flex" justifyContent="space-between" alignItems="center">
            <Typography className="title" variant="h4" component="h1">
              Codebase Context Editor
            </Typography>
            <Box display="flex" alignItems="center">
              <Button 
                onClick={() => setSpecModalOpen(true)} 
                variant="contained" 
                color="primary" 
                sx={{ mr: 2 }}
              >
                View Specification
              </Button>
              <MuiLink href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                <GitHubIcon fontSize="large" />
              </MuiLink>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <NavTabs value={selectedTab} onChange={handleTabChange} />

          {selectedTab === 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>Coding Assistant Prompts</Typography>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Claude-dev Prompt</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <PromptViewer 
                    title="CLAUDE-DEV Prompt"
                    subtitle="CLAUDE-DEV-PROMPT.md"
                    explanation={codingAssistantPrompts['claude-dev']?.explanation || ''}
                    content={codingAssistantPrompts['claude-dev']?.content || ''}
                    onCopy={() => handleCopy(codingAssistantPrompts['claude-dev']?.content || '')}
                  />
                </AccordionDetails>
              </Accordion>
              {/* Add other coding assistant prompts here if needed */}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>Generate Context Files</Typography>
              <PromptViewer 
                title="Generate Context Prompt" 
                subtitle="GENERATE-CONTEXT-PROMPT.md"
                explanation={generateContextPrompt.explanation}
                content={generateContextPrompt.content} 
                onCopy={() => handleCopy(generateContextPrompt.content)} 
              />
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>Manual Context Form</Typography>
              <ContextForm onSubmit={handleContextFormSubmit} />
            </Box>
          )}
        </Paper>

        <SpecificationModal
          open={specModalOpen}
          onClose={() => setSpecModalOpen(false)}
          content={codebaseContext.content}
          onCopy={() => handleCopy(codebaseContext.content)}
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
    </ThemeProvider>
  );
};

export default App;
