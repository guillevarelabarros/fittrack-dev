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
  Avatar,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import EditActivityModal from './EditActivityModal'; // Importar el nuevo componente
import { useSnackbar } from 'notistack';

export default function ActivityList() {
  const { state, dispatch, isEmptyActivities, categoryName } = useActivity();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Estado para la eliminación
  const [openDialog, setOpenDialog] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string>('');

  // Estado para la edición (modal)
  const [openEditModal, setOpenEditModal] = useState(false);

  // Eliminar
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

  // Editar con Modal
  const handleEditClick = (id: string) => {
    // Setea la actividad activa y abre el modal
    dispatch({ type: 'set-activeId', payload: { id } });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
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
            <Grid item xs={12} md={6} key={activity.id}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#2c2c2c' : '#ffffff',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      activity.category === 1
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                    mr: 2,
                  }}
                >
                  {activity.category === 1 ? 'C' : 'E'}
                </Avatar>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography variant='h6' component='div'>
                    {activity.name}
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    {categoryName(activity.category)}
                  </Typography>
                  <Typography variant='body1' color='success.main'>
                    {activity.calories} Calorías
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title='Editar'>
                    <IconButton
                      color='primary'
                      onClick={() => handleEditClick(activity.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Eliminar'>
                    <IconButton
                      color='error'
                      onClick={() => handleDeleteClick(activity.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        open={openDialog}
        title='Confirmar Eliminación'
        content='¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.'
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal para Editar Actividad */}
      <EditActivityModal open={openEditModal} onClose={handleCloseEditModal} />
    </Box>
  );
}
