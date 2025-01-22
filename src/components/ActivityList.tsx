// src/components/ActivityList.tsx
import { Edit, Delete } from '@mui/icons-material';
import { useActivity } from '../hooks/useActivity';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog'; // Importar el nuevo componente
import { useSnackbar } from 'notistack'; // Importar notistack

export default function ActivityList() {
  const { state, dispatch, isEmptyActivities, categoryName } = useActivity();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar(); // Inicializar notistack

  const [openDialog, setOpenDialog] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string>('');

  const handleDeleteClick = (id: string) => {
    setActivityToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch({
      type: 'delete-activity',
      payload: { id: activityToDelete },
    });
    enqueueSnackbar('Actividad eliminada exitosamente', { variant: 'success' });
    setOpenDialog(false);
    setActivityToDelete('');
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setActivityToDelete('');
  };

  return (
    <Box>
      <Typography
        variant='h4'
        component='h2'
        align='center'
        color='textSecondary'
        gutterBottom
      >
        Comida y Actividades
      </Typography>

      {isEmptyActivities ? (
        <Typography variant='body1' align='center' sx={{ my: 2 }}>
          No hay actividades aún...
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {state.activities.map(activity => (
            <Grid item xs={12} key={activity.id}>
              <Card
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#2c2c2c' : '#ffffff',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      backgroundColor:
                        activity.category === 1
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                      color: 'white',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    {categoryName(+activity.category).join(', ')}
                  </Box>
                  <Typography variant='h5' component='div'>
                    {activity.name}
                  </Typography>
                  <Typography variant='h4' component='div' color='success.main'>
                    {activity.calories} Calorías
                  </Typography>
                </CardContent>

                <CardActions>
                  <IconButton
                    color='primary'
                    onClick={() =>
                      dispatch({
                        type: 'set-activeId',
                        payload: { id: activity.id },
                      })
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color='error'
                    onClick={() => handleDeleteClick(activity.id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        open={openDialog}
        title='Confirmar Eliminación'
        content='¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.'
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
