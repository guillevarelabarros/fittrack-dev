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
import { useSnackbar } from 'notistack';

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
    calories: 0,
  });
  const { enqueueSnackbar } = useSnackbar();

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === 'calories' && Number(value) < 0) {
      enqueueSnackbar('Calories cannot be negative.', {
        variant: 'error',
      });
      return;
    }

    setActivity({
      ...activity,
      [id]: id === 'calories' ? Number(value) : value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { value } = e.target;
    setActivity({
      ...activity,
      category: Number(value),
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
        ? 'Activity edited successfully'
        : 'Activity added successfully',
      { variant: 'success' }
    );
    setActivity({
      ...initialState,
      id: uuidv4(),
      calories: 0,
    });
  };

  const handleCancelEdit = () => {
    setActivity({
      ...initialState,
      id: uuidv4(),
      calories: 0,
    });
    dispatch({ type: 'set-activeId', payload: { id: '' } });
    enqueueSnackbar('Editing canceled', { variant: 'info' });
  };

  const getNameFieldProps = () => {
    if (activity.category === 1) {
      return {
        label: 'What food?',
        placeholder: 'e.g. Orange Juice, Salad, etc.',
      };
    } else {
      return {
        label: 'Activity',
        placeholder: 'e.g. Weights, Biking, Running, etc.',
      };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant='h5' component='h3' gutterBottom>
        {isEditing ? 'Edit Activity' : 'Add Activity'}
      </Typography>

      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={isEditing ? 6 : 12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='category-label'>Category</InputLabel>
              <Select
                labelId='category-label'
                id='category'
                value={activity.category}
                label='Category'
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
                Cancel Editing
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
          helperText={activity.name.trim() === '' ? 'Name is required' : ''}
        />

        <TextField
          id='calories'
          label='Calories'
          type='number'
          variant='outlined'
          fullWidth
          placeholder='Calories, e.g. 300 or 500'
          value={activity.calories === 0 ? '' : activity.calories}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            inputProps: {
              min: 1,
            },
          }}
          error={activity.calories <= 0}
          helperText={
            activity.calories <= 0 ? 'Calories must be greater than 0' : ''
          }
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={!isValidActivity()}
        >
          {isEditing ? 'Save Changes' : 'Save Activity'}
        </Button>
      </Box>
    </Paper>
  );
}
