import React, { useState } from 'react';
import { Container, Paper, Modal, Box, Button, Typography, Tabs, Tab, Link } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';
import theme from './theme';
import ContextForm from './components/ContextForm';
import ContextDocsForm from './components/ContextDocsForm';
import ContextIgnoreForm from './components/ContextIgnoreForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleFormSubmit = (content: string) => {
    setGeneratedContent(content);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
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
              <Link href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
                https://github.com/Agentic-Insights/codebase-context-spec
              </Link>
            </Typography>
          </Box>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="file type tabs">
            <Tab icon={<DescriptionIcon />} label=".context.md" />
            <Tab icon={<LibraryBooksIcon />} label=".contextdocs.md" />
            <Tab icon={<BlockIcon />} label=".contextignore" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <ContextForm onSubmit={handleFormSubmit} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ContextDocsForm onSubmit={handleFormSubmit} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ContextIgnoreForm onSubmit={handleFormSubmit} />
          </TabPanel>
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
    </ThemeProvider>
  );
};

export default App;
