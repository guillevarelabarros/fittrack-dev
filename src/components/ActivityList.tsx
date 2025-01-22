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

export default function ActivityList() {
  const { state, dispatch, isEmptyActivities, categoryName } = useActivity();
  const theme = useTheme();

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
                    onClick={() =>
                      dispatch({
                        type: 'delete-activity',
                        payload: { id: activity.id },
                      })
                    }
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
