import React from 'react';
import { Tabs, Tab } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';

interface NavTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ value, onChange }) => {
  return (
    <Tabs value={value} onChange={onChange} aria-label="file type tabs" variant="fullWidth">
      <Tab 
        icon={<DescriptionIcon />} 
        label="Coding Assistant Prompts" 
        sx={{ textTransform: 'none' }}
      />
      <Tab 
        icon={<LibraryBooksIcon />} 
        label="Generate Context Files" 
        sx={{ textTransform: 'none' }}
      />
      <Tab 
        icon={<BlockIcon />} 
        label="Manual Context Form" 
        sx={{ textTransform: 'none' }}
      />
    </Tabs>
  );
};

export default NavTabs;