import React from 'react';
import {
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel
} from '@mui/material';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ScheduleForm = ({ 
  currentSchedule, 
  setCurrentSchedule, 
  onSubmit, 
  employees, 
  roles, 
  editMode 
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Empleado</InputLabel>
            <Select
              value={currentSchedule.employee_id}
              label="Empleado"
              onChange={(e) => setCurrentSchedule({...currentSchedule, employee_id: e.target.value})}
            >
              {employees.map(employee => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={currentSchedule.role_id}
              label="Rol"
              onChange={(e) => setCurrentSchedule({...currentSchedule, role_id: e.target.value})}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Día</InputLabel>
            <Select
              value={currentSchedule.day}
              label="Día"
              onChange={(e) => setCurrentSchedule({...currentSchedule, day: e.target.value})}
            >
              {daysOfWeek.map(day => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                type="time"
                fullWidth
                value={currentSchedule.start_time}
                onChange={(e) => setCurrentSchedule({...currentSchedule, start_time: e.target.value})}
                InputLabelProps={{ shrink: true }}
                label="Hora inicio"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="time"
                fullWidth
                value={currentSchedule.end_time}
                onChange={(e) => setCurrentSchedule({...currentSchedule, end_time: e.target.value})}
                InputLabelProps={{ shrink: true }}
                label="Hora fin"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit"
            variant="contained"
            fullWidth
          >
            {editMode ? 'Actualizar Horario' : 'Crear Horario'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
