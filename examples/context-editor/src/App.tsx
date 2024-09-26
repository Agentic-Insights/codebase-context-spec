import React, { useState } from 'react';
import { Container, Paper, Box, Button, Typography, Link as MuiLink, Snackbar, IconButton, Accordion, AccordionSummary, AccordionDetails, Divider, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from './theme';
import PromptViewer from './components/PromptViewer';
import SpecificationModal from './components/SpecificationModal';
import { handleCopyToClipboard } from './utils/helpers';
import usePrompts from './hooks/usePrompts';
import useSnackbar from './hooks/useSnackbar';
import './App.css';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/codebase-context-spec' : '';

const App: React.FC = () => {
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');
  const [loadedPrompt, setLoadedPrompt] = useState<string | null>(null);

  const { snackbarOpen, snackbarMessage, showSnackbar, closeSnackbar } = useSnackbar();
  const { codebaseContext, generateContextPrompt, codingAssistantPrompts } = usePrompts(
    showSnackbar,
    (open: boolean) => open ? showSnackbar('') : closeSnackbar()
  );

  const handleToolChange = (event: SelectChangeEvent<string>) => {
    setSelectedTool(event.target.value as string);
    setLoadedPrompt(null);
  };

  const handleLoadPrompt = () => {
    if (selectedTool && codingAssistantPrompts[selectedTool]) {
      setLoadedPrompt(selectedTool);
      showSnackbar(`Loaded ${selectedTool} prompt`);
    } else {
      showSnackbar('Please select a valid tool first');
    }
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
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  View Latest Specification v1.0.0-RFC
                </Button>
                <MuiLink href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon fontSize="large" />
                </MuiLink>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel id="coding-tool-select-label">Select Coding Tool</InputLabel>
                <Select
                  labelId="coding-tool-select-label"
                  value={selectedTool}
                  onChange={handleToolChange}
                  label="Select Coding Tool"
                >
                  <MenuItem value="claude-dev">Claude-dev</MenuItem>
                  <MenuItem value="aider">Aider</MenuItem>
                  <MenuItem value="cody">Cody</MenuItem>
                  {/* Add more tools as needed */}
                </Select>
              </FormControl>
              <Button variant="contained" color="secondary" onClick={handleLoadPrompt}>
                Load Prompt
              </Button>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>Coding Assistant Prompts</Typography>
            
            {loadedPrompt && codingAssistantPrompts[loadedPrompt] && (
              <PromptViewer 
                title={`${loadedPrompt.toUpperCase()} Prompt`}
                subtitle={`${loadedPrompt.toUpperCase()}-PROMPT.md`}
                explanation={codingAssistantPrompts[loadedPrompt].explanation}
                content={codingAssistantPrompts[loadedPrompt].content}
                onCopy={() => handleCopyToClipboard(codingAssistantPrompts[loadedPrompt].content, showSnackbar, () => showSnackbar(''))}
              />
            )}

            <Divider sx={{ my: 3 }} />

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Generate Context Files</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Use the 'Generate Context Prompt' to get an AI agent to draft your context files.
                </Typography>
                <PromptViewer 
                  title="Generate Context Prompt" 
                  subtitle="GENERATE-CONTEXT-PROMPT.md"
                  explanation={generateContextPrompt.explanation}
                  content={generateContextPrompt.content} 
                  onCopy={() => handleCopyToClipboard(generateContextPrompt.content, showSnackbar, () => showSnackbar(''))} 
                />
              </AccordionDetails>
            </Accordion>
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
