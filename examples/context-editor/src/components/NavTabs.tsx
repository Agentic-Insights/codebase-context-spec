import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';

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

export default NavTabs;