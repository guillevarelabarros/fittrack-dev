// src/components/CalorieTracker.tsx
import CalorieDisplay from './CalorieDisplay';
import CalorieChart from './CalorieChart';
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
        color='textPrimary'
        gutterBottom
      >
        Calories Summary
      </Typography>
      <Grid container spacing={2} justifyContent='center' sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={caloriesConsumed} text='Consumed' />
        </Grid>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={caloriesBurned} text='Exercise' />
        </Grid>
        <Grid item xs={12} md={4}>
          <CalorieDisplay calories={netCalories} text='Difference' />
        </Grid>
      </Grid>
      <CalorieChart />
    </Box>
  );
}
