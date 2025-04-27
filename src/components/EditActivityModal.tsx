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
import { SelectChangeEvent } from '@mui/material/Select';
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

  const [localActivity, setLocalActivity] = useState<Activity>({
    id: '',
    category: 1,
    name: '',
    calories: 0,
  });

  const isEditing = state.activeId !== '';

  useEffect(() => {
    if (isEditing) {
      const selectedActivity = state.activities.find(
        activity => activity.id === state.activeId
      );
      if (selectedActivity) {
        setLocalActivity(selectedActivity);
      }
    } else {
      setLocalActivity({
        id: uuidv4(),
        category: 1,
        name: '',
        calories: 0,
      });
    }
  }, [isEditing, state.activeId, state.activities]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'calories' && Number(value) < 0) {
      enqueueSnackbar('Calories must be greater than 0.', { variant: 'error' });
      return;
    }

    setLocalActivity({
      ...localActivity,
      [id]: id === 'calories' ? Number(value) : value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { value } = e.target;
    setLocalActivity(prev => ({
      ...prev,
      category: Number(value),
      name: '',
    }));
  };

  const isValidActivity = () => {
    return localActivity.name.trim() !== '' && localActivity.calories > 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'save-activity',
      payload: { newActivity: localActivity },
    });

    enqueueSnackbar(
      isEditing
        ? 'Activity successfully edited'
        : 'Activity successfully added',
      { variant: 'success' }
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch({ type: 'set-activeId', payload: { id: '' } });
    onClose();
  };

  const getNameFieldProps = () => {
    if (localActivity.category === 1) {
      return {
        label: 'Food Name',
        placeholder: 'e.g. Orange Juice, Salad, etc.',
      };
    } else {
      return {
        label: 'Activity Name',
        placeholder: 'e.g. Weights, Cycling, Running, etc.',
      };
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>{isEditing ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Fill in the fields below to {isEditing ? 'edit' : 'add'} an activity.
        </DialogContentText>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='category-label'>Category</InputLabel>
                <Select
                  labelId='category-label'
                  id='category'
                  value={localActivity.category}
                  label='Category'
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
                  localActivity.name.trim() === '' ? 'Name is required' : ''
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id='calories'
                label='Calories'
                type='number'
                variant='outlined'
                placeholder='e.g. 300 or 500'
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
                    ? 'Calories must be greater than 0'
                    : ''
                }
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={handleClose} color='secondary'>
              Cancel
            </Button>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              disabled={!isValidActivity()}
            >
              {isEditing ? 'Save Changes' : 'Save Activity'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
