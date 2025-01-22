// src/components/Form.tsx
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../data/categories';
import type { Activity } from '../types';
import { useActivity } from '../hooks/useActivity';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useSnackbar } from 'notistack'; // Importar notistack

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0,
};

export default function Form() {
  const { state, dispatch } = useActivity();
  const [activity, setActivity] = useState<Activity>(initialState);
  const { enqueueSnackbar } = useSnackbar(); // Inicializar notistack

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.find(
        stateActivity => stateActivity.id === state.activeId
      );
      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [state.activeId, state.activities]);

  // Manejador de cambios para TextField
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setActivity({
      ...activity,
      [id]: id === 'calories' ? Number(value) : value,
    });
  };

  // Manejador de cambios para Select
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { value } = e.target;
    setActivity({
      ...activity,
      category: Number(value),
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== '' && calories > 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: 'save-activity', payload: { newActivity: activity } });
    enqueueSnackbar('Actividad guardada exitosamente', { variant: 'success' }); // Mostrar notificación
    setActivity({
      ...initialState,
      id: uuidv4(),
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant='h5' component='h3' gutterBottom>
        Agregar Actividad
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id='category-label'>Categoría</InputLabel>
          <Select
            labelId='category-label'
            id='category'
            value={activity.category}
            label='Categoría'
            onChange={handleSelectChange}
            error={activity.category === 0}
          >
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id='name'
          label='Actividad'
          variant='outlined'
          fullWidth
          placeholder='Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta'
          value={activity.name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          error={activity.name.trim() === ''}
          helperText={
            activity.name.trim() === '' ? 'El nombre es obligatorio' : ''
          }
        />

        <TextField
          id='calories'
          label='Calorías'
          type='number'
          variant='outlined'
          fullWidth
          placeholder='Calorías. ej. 300 o 500'
          value={activity.calories}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          error={activity.calories <= 0}
          helperText={
            activity.calories <= 0 ? 'Las calorías deben ser mayores que 0' : ''
          }
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={!isValidActivity()}
        >
          {activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        </Button>
      </Box>
    </Paper>
  );
}
