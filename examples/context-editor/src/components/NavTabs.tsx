import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';

interface NavTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={value} 
        onChange={onChange} 
        aria-label="file type tabs" 
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            padding: '12px 16px',
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          },
        }}
      >
        <Tab 
          icon={<DescriptionIcon />} 
          label="Coding Assistant Prompts" 
          sx={{ 
            '&.Mui-selected': { 
              fontWeight: 'bold',
            },
          }}
        />
        <Tab 
          icon={<LibraryBooksIcon />} 
          label="Generate Context Files" 
          sx={{ 
            '&.Mui-selected': { 
              fontWeight: 'bold',
            },
          }}
        />
        <Tab 
          icon={<BlockIcon />} 
          label="Manual Context Form" 
          sx={{ 
            '&.Mui-selected': { 
              fontWeight: 'bold',
            },
          }}
        />
      </Tabs>
    </Box>
  );
};

export default NavTabs;