// src/components/EditActivityModal.tsx
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Activity } from '../types';
import { useActivity } from '../hooks/useActivity';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../data/categories';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select'; // Importar tipo de evento
import { useSnackbar } from 'notistack';

type EditActivityModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditActivityModal({
  open,
  onClose,
}: EditActivityModalProps) {
  const { state, dispatch } = useActivity();
  const { enqueueSnackbar } = useSnackbar();

  // Estado local para la actividad que se está editando
  const [localActivity, setLocalActivity] = useState<Activity>({
    id: '',
    category: 1,
    name: '',
    calories: 0,
  });

  // Determinar si se está editando
  const isEditing = state.activeId !== '';

  // Efecto para cargar la actividad cuando se abre el modal
  useEffect(() => {
    if (isEditing) {
      const selectedActivity = state.activities.find(
        activity => activity.id === state.activeId
      );
      if (selectedActivity) {
        setLocalActivity(selectedActivity);
      }
    } else {
      // Si no se está editando, limpiar el formulario
      setLocalActivity({
        id: uuidv4(),
        category: 1,
        name: '',
        calories: 0,
      });
    }
  }, [isEditing, state.activeId, state.activities]);

  // Manejador de cambios para los TextField
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Validar que las calorías no sean negativas
    if (id === 'calories' && Number(value) < 0) {
      enqueueSnackbar('Las calorías no pueden ser negativas.', {
        variant: 'error',
      });
      return;
    }

    setLocalActivity({
      ...localActivity,
      [id]: id === 'calories' ? Number(value) : value,
    });
  };

  // Manejador de cambios para el Select
  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { value } = e.target;
    setLocalActivity(prev => ({
      ...prev,
      category: Number(value),
      name: '',
    }));
  };

  // Validar que la actividad sea correcta
  const isValidActivity = () => {
    return localActivity.name.trim() !== '' && localActivity.calories > 0;
  };

  // Al hacer submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'save-activity',
      payload: { newActivity: localActivity },
    });

    enqueueSnackbar(
      isEditing
        ? 'Actividad editada exitosamente'
        : 'Actividad agregada exitosamente',
      { variant: 'success' }
    );

    // Cerrar modal y resetear activeId
    handleClose();
  };

  // Cerrar modal y resetear state.activeId
  const handleClose = () => {
    dispatch({ type: 'set-activeId', payload: { id: '' } });
    onClose();
  };

  // Obtener la etiqueta y placeholder dependiendo de la categoría
  const getNameFieldProps = () => {
    if (localActivity.category === 1) {
      return {
        label: '¿Qué comida?',
        placeholder: 'Ej. Jugo de Naranja, Ensalada, etc.',
      };
    } else {
      return {
        label: 'Actividad',
        placeholder: 'Ej. Pesas, Bicicleta, Correr, etc.',
      };
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        {isEditing ? 'Editar Actividad' : 'Agregar Actividad'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Completa los siguientes campos para {isEditing ? 'editar' : 'agregar'}{' '}
          una actividad.
        </DialogContentText>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='category-label'>Categoría</InputLabel>
                <Select
                  labelId='category-label'
                  id='category'
                  value={localActivity.category}
                  label='Categoría'
                  onChange={handleSelectChange}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id='name'
                label={getNameFieldProps().label}
                variant='outlined'
                placeholder={getNameFieldProps().placeholder}
                value={localActivity.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={localActivity.name.trim() === ''}
                helperText={
                  localActivity.name.trim() === ''
                    ? 'El nombre es obligatorio'
                    : ''
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id='calories'
                label='Calorías'
                type='number'
                variant='outlined'
                placeholder='Calorías. ej. 300 o 500'
                value={
                  localActivity.calories === 0 ? '' : localActivity.calories
                }
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
                error={localActivity.calories <= 0}
                helperText={
                  localActivity.calories <= 0
                    ? 'Las calorías deben ser mayores que 0'
                    : ''
                }
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={handleClose} color='secondary'>
              Cancelar
            </Button>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              disabled={!isValidActivity()}
            >
              {isEditing ? 'Guardar Cambios' : 'Guardar Actividad'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// EditActivityModal;
