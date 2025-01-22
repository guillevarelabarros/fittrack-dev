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
          ...(mode === 'light'
            ? {
                // Paleta para modo claro
                primary: {
                  main: '#84cc16', // Verde claro
                },
                secondary: {
                  main: '#f44336', // Rojo para botones secundarios
                },
                background: {
                  default: '#fafafa',
                  paper: '#ffffff',
                },
              }
            : {
                // Paleta para modo oscuro
                primary: {
                  main: '#4caf50', // Verde oscuro
                },
                secondary: {
                  main: '#ff5252', // Rojo claro para botones secundarios
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
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
