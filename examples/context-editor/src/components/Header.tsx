import React from 'react';
import { Typography, Link, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Codebase Context Editor
      </Typography>
      <Typography variant="body1" paragraph>
        This editor helps you create .context.md, .contextdocs.md, and .contextignore files for your project.
      </Typography>
      <Typography variant="body1">
        GitHub Repository:{' '}
        <Link href="https://github.com/Agentic-Insights/codebase-context-spec" target="_blank" rel="noopener noreferrer">
          https://github.com/Agentic-Insights/codebase-context-spec
        </Link>
      </Typography>
    </Box>
  );
};

export default Header;