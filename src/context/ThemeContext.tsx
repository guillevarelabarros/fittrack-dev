// src/context/ThemeContext.tsx
import { useState, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext } from './ColorModeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const storedMode = localStorage.getItem('themeMode') as PaletteMode;
    return storedMode ? storedMode : 'light';
  });

  // Función para alternar entre modo claro y oscuro
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode); // Persistir en localStorage
          return newMode;
        });
      },
    }),
    []
  );

  // Crear el tema de MUI basado en el modo actual
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#4caf50' : '#81c784', // Verde más sofisticado
          },
          secondary: {
            main: '#ff9800', // Naranja para un contraste vibrante
          },
          background: {
            default: mode === 'light' ? '#fafafa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#ffffff',
            secondary: mode === 'light' ? '#555555' : '#bbbbbb',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h5: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#333333',
                color: mode === 'light' ? '#4caf50' : '#ff9800',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                minHeight: 64,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8, // Bordes más redondeados
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
