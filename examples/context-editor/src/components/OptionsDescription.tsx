import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const OptionsDescription: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={3}
      sx={{
        mb: 3,
        mt: 2,
        p: 3,
        borderLeft: `6px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        Two Ways to Generate Context Files:
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle1" color="secondary" fontWeight="medium">
                1. AI-Assisted Drafting
              </Typography>
            }
            secondary={
              <React.Fragment>
                <Typography variant="body2">
                  Use the 'Generate Context Prompt' to get an AI agent to draft your context files. Copy the prompt and paste it to your preferred AI assistant.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Note: You may need to copy the specification into your project's root directory unless your AI assistant can retrieve the latest spec automatically.
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle1" color="secondary" fontWeight="medium">
                2. Manual Form Completion
              </Typography>
            }
            secondary={
              <Typography variant="body2">
                Fill out the structured form below to generate your context files. This gives you more control over the content.
              </Typography>
            }
          />
        </ListItem>
      </List>
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        Both methods will help you create .context.md and .contextdocs.md files based on the Codebase Context Specification.
      </Typography>
    </Paper>
  );
};

export default OptionsDescription;