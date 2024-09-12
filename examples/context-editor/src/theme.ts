import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee',
      light: '#9d46ff',
      dark: '#3700b3',
    },
    secondary: {
      main: '#03dac6',
      light: '#66fff9',
      dark: '#00a896',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#4a4e69',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      background: 'linear-gradient(45deg, #6200ee 30%, #9d46ff 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      letterSpacing: '0.05em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#3700b3',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(45deg, #6200ee 30%, #03dac6 90%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#6200ee',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6200ee',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          '&.viewLatestSpec': {
            background: 'linear-gradient(45deg, #6200ee 0%, #9d46ff 50%, #d4a5ff 100%)',
            color: '#ffffff',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #3700b3 0%, #6200ee 50%, #9d46ff 100%)',
            },
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6200ee 30%, #9d46ff 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #3700b3 30%, #6200ee 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #03dac6 30%, #66fff9 90%)',
          color: '#1a1a2e',
          '&:hover': {
            background: 'linear-gradient(45deg, #00a896 30%, #03dac6 90%)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(98, 0, 238, 0.1)',
          },
          '&.Mui-selected': {
            color: '#6200ee',
          },
        },
      },
    },
  },
});

export default theme;