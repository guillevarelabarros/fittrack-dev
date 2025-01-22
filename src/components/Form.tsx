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
  Grid,
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
  const [activity, setActivity] = useState<Activity>({
    ...initialState,
    calories: 0, // Inicializar con 0 para mostrar el placeholder
  });
  const { enqueueSnackbar } = useSnackbar(); // Inicializar notistack

  const isEditing = state.activeId !== '';

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

    // Validar que las calorías no sean negativas
    if (id === 'calories' && Number(value) < 0) {
      enqueueSnackbar('Las calorías no pueden ser negativas.', {
        variant: 'error',
      });
      return;
    }

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
      // Reiniciar el nombre al cambiar la categoría
      name: '',
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== '' && calories > 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: 'save-activity', payload: { newActivity: activity } });
    enqueueSnackbar(
      isEditing
        ? 'Actividad editada exitosamente'
        : 'Actividad agregada exitosamente',
      { variant: 'success' }
    );
    setActivity({
      ...initialState,
      id: uuidv4(),
      calories: 0, // Reiniciar con 0 para mostrar el placeholder
    });
  };

  const handleCancelEdit = () => {
    // Reiniciar el formulario al estado inicial
    setActivity({
      ...initialState,
      id: uuidv4(),
      calories: 0,
    });
    // Resetear activeId en el estado global
    dispatch({ type: 'set-activeId', payload: { id: '' } });
    enqueueSnackbar('Edición cancelada', { variant: 'info' });
  };

  // Determinar etiqueta y placeholder según la categoría seleccionada
  const getNameFieldProps = () => {
    if (activity.category === 1) {
      // Comida
      return {
        label: '¿Qué comida?',
        placeholder: 'Ej. Jugo de Naranja, Ensalada, etc.',
      };
    } else {
      // Ejercicio
      return {
        label: 'Actividad',
        placeholder: 'Ej. Pesas, Bicicleta, Correr, etc.',
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant='h5' component='h3' gutterBottom>
        {isEditing ? 'Editar Actividad' : 'Agregar Actividad'}
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={isEditing ? 6 : 12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='category-label'>Categoría</InputLabel>
              <Select
                labelId='category-label'
                id='category'
                value={activity.category}
                label='Categoría'
                onChange={handleSelectChange}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {isEditing && (
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleCancelEdit}
                fullWidth
              >
                Cancelar Edición
              </Button>
            </Grid>
          )}
        </Grid>

        <TextField
          id='name'
          label={getNameFieldProps().label}
          variant='outlined'
          fullWidth
          placeholder={getNameFieldProps().placeholder}
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
          value={activity.calories === 0 ? '' : activity.calories} // Mostrar vacío si es 0
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            inputProps: {
              min: 1, // Evitar números negativos
            },
          }}
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
          {isEditing ? 'Guardar Cambios' : 'Guardar Actividad'}
        </Button>
      </Box>
    </Paper>
  );
}
