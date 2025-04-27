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
} from '@mui/icons-material';
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
    enqueueSnackbar('App successfully restarted', { variant: 'info' });
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position='static' color='primary' elevation={4}>
        <Toolbar>
          <LocalFireDepartment sx={{ mr: 2 }} />

          <Typography
            variant={isSmallScreen ? 'h6' : 'h5'}
            component='div'
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              textTransform: 'none',
              fontWeight: 'bold',
              color: theme.palette.secondary.main,
            }}
          >
            FitTrack - Calorie Manager
          </Typography>

          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Button
            variant='contained'
            color='secondary'
            disabled={!canRestartApp}
            onClick={handleRestartApp}
            sx={{ ml: 2, textTransform: 'none' }}
          >
            Restart App
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
