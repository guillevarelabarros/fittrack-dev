// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ActivityProvider } from './context/ActivityProvider'; // Importación correcta
import { CustomThemeProvider } from './context/ThemeContext';
import { SnackbarProvider } from 'notistack'; // Importar notistack

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <ActivityProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <App />
        </SnackbarProvider>
      </ActivityProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
