// src/components/CalorieDisplay.tsx
import { Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type CalorieDisplayProps = {
  calories: number;
  text: string;
};

export default function CalorieDisplay({
  calories,
  text,
}: CalorieDisplayProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
      }}
    >
      <Typography
        variant='h2'
        component='p'
        sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 1 }}
      >
        {calories}
      </Typography>
      <Typography variant='subtitle1'>{text}</Typography>
    </Paper>
  );
}
