// src/hooks/useColorMode.ts
import { useContext } from 'react';
import { ColorModeContext } from '../context/ColorModeContext'; // Importar desde el nuevo archivo

type ThemeContextProps = {
  toggleColorMode: () => void;
};

export const useColorMode = (): ThemeContextProps => {
  return useContext(ColorModeContext);
};
