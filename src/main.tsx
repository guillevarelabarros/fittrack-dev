// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ActivityProvider } from './context/ActivityContext.tsx';
import { CustomThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <ActivityProvider>
        <App />
      </ActivityProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
