// src/components/CalorieTracker.tsx
import CalorieDisplay from './CalorieDisplay';
import { useActivity } from '../hooks/useActivity';
import { Typography, Grid, Box } from '@mui/material';

export default function CalorieTracker() {
  const { caloriesConsumed, caloriesBurned, netCalories } = useActivity();

  return (
    <Box>
      <Typography
        variant='h4'
        component='h2'
        align='center'
        color='white'
        gutterBottom
      >
        Resumen de Calorías
      </Typography>

      <Grid container spacing={2} justifyContent='center' sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={caloriesConsumed} text='Consumidas' />
        </Grid>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={caloriesBurned} text='Ejercicio' />
        </Grid>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={netCalories} text='Diferencia' />
        </Grid>
      </Grid>
    </Box>
  );
}
