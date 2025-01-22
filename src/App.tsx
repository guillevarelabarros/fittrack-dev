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
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useColorMode } from './hooks/useColorMode';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack'; // Importar notistack

function App() {
  const { state, dispatch } = useActivity();
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar(); // Inicializar notistack

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

  return (
    <>
      <AppBar position='static' color='primary'>
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Contador de Calorías
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            variant='contained'
            color='secondary'
            disabled={!canRestartApp}
            onClick={handleRestartApp} // Usar la nueva función
            sx={{ ml: 2 }}
          >
            Reiniciar App
          </Button>
        </Toolbar>
      </AppBar>

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
