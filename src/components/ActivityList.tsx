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
import EditActivityModal from './EditActivityModal';
import { useSnackbar } from 'notistack';

export default function ActivityList() {
  const { state, dispatch, isEmptyActivities, categoryName } = useActivity();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleDeleteClick = (id: string) => {
    setActivityToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch({
      type: 'delete-activity',
      payload: { id: activityToDelete },
    });
    enqueueSnackbar('Activity deleted successfully', { variant: 'success' });
    setOpenDialog(false);
    setActivityToDelete('');
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setActivityToDelete('');
  };

  const handleEditClick = (id: string) => {
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
        Meals & Activities
      </Typography>

      {isEmptyActivities ? (
        <Typography variant='body1' align='center' sx={{ my: 2 }}>
          No activities yet...
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
                  {activity.category === 1 ? 'F' : 'E'}
                </Avatar>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography variant='h6' component='div'>
                    {activity.name}
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    {categoryName(activity.category)}
                  </Typography>
                  <Typography variant='body1' color='success.main'>
                    {activity.calories} Calories
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title='Edit'>
                    <IconButton
                      color='primary'
                      onClick={() => handleEditClick(activity.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
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

      <ConfirmDialog
        open={openDialog}
        title='Confirm Deletion'
        content='Are you sure you want to delete this activity? This action cannot be undone.'
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <EditActivityModal open={openEditModal} onClose={handleCloseEditModal} />
    </Box>
  );
}
