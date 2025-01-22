// src/App.tsx
import { useEffect, useMemo } from 'react';
import Form from './components/Form';
import ActivityList from './components/ActivityList';
import CalorieTracker from './components/CalorieTracker';
import { useActivity } from './hooks/useActivity';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  LocalFireDepartment,
} from '@mui/icons-material'; // Añadido un icono
import { useColorMode } from './hooks/useColorMode';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';

function App() {
  const { state, dispatch } = useActivity();
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(state.activities));
  }, [state.activities]);

  const canRestartApp = useMemo(
    () => state.activities.length > 0,
    [state.activities]
  );

  const handleRestartApp = () => {
    dispatch({ type: 'restart-app' });
    enqueueSnackbar('Aplicación reiniciada correctamente', { variant: 'info' });
  };

  // Detectar si la pantalla es pequeña para ajustar la tipografía
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position='static' color='primary' elevation={4}>
        <Toolbar>
          {/* Icono o Logo */}
          <LocalFireDepartment sx={{ mr: 2 }} />

          <Typography
            variant={isSmallScreen ? 'h6' : 'h5'} // Ajustar tamaño según pantalla
            component='div'
            sx={{
              flexGrow: 1,
              textAlign: 'left', // Alinear a la izquierda para mejor balance
              textTransform: 'none', // Mantener el caso original
              fontWeight: 'bold', // Hacer el texto más grueso
              color: theme.palette.secondary.main, // Cambiar color para mejor contraste
            }}
          >
            Contador de Calorías
          </Typography>

          {/* Botón para alternar modo de color */}
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Botón para reiniciar la aplicación */}
          <Button
            variant='contained'
            color='secondary'
            disabled={!canRestartApp}
            onClick={handleRestartApp}
            sx={{ ml: 2, textTransform: 'none' }} // Evitar mayúsculas
          >
            Reiniciar App
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido Principal */}
      <Box sx={{ py: 5, px: 2 }}>
        <Container maxWidth='lg'>
          <Form />
        </Container>
      </Box>

      <Box sx={{ py: 2 }}>
        <Container maxWidth='lg'>
          <CalorieTracker />
        </Container>
      </Box>

      <Box sx={{ p: 2 }}>
        <Container maxWidth='lg'>
          <ActivityList />
        </Container>
      </Box>
    </>
  );
}

export default App;
