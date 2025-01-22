// src/components/CalorieChart.tsx
import { useActivity } from '../hooks/useActivity';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper, Typography } from '@mui/material';

const CalorieChart = () => {
  const { caloriesConsumed, caloriesBurned } = useActivity();

  const data = [
    {
      name: 'Calorías',
      Consumidas: caloriesConsumed,
      Quemadas: caloriesBurned,
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant='h6' gutterBottom align='center'>
        Gráfico de Calorías
      </Typography>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <XAxis dataKey='name' />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey='Consumidas' fill='#84cc16' />
          <Bar dataKey='Quemadas' fill='#f44336' />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CalorieChart;
