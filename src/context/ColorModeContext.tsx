// src/context/ColorModeContext.tsx
import { createContext } from 'react';

type ThemeContextProps = {
  toggleColorMode: () => void;
};

// Se crea y exporta el contexto con un valor predeterminado
export const ColorModeContext = createContext<ThemeContextProps>({
  toggleColorMode: () => {},
});
