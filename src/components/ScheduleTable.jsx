import React, { forwardRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography
} from '@mui/material';

export const ScheduleTable = forwardRef(({ schedules, employees, onEdit, onDelete }, ref) => {
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const employeeId = schedule.employee_id;
    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: employees.find(e => e.id === employeeId),
        schedules: {}
      };
    }
    if (!acc[employeeId].schedules[schedule.day]) {
      acc[employeeId].schedules[schedule.day] = [];
    }
    acc[employeeId].schedules[schedule.day].push(schedule);
    return acc;
  }, {});

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <Paper elevation={2} sx={{ mt: 4 }} ref={ref}>
      <Box p={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Horarios Semanales
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Empleado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                {daysOfWeek.map(day => (
                  <TableCell key={day} sx={{ fontWeight: 'bold' }}>
                    {day}
                  </TableCell>
                ))}
                {!ref && <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(groupedSchedules).map(({ employee, schedules }) => (
                <TableRow key={employee.id}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {employee.name}
                  </TableCell>
                  <TableCell>
                    {schedules[Object.keys(schedules)[0]][0].role_id}
                  </TableCell>
                  {daysOfWeek.map(day => (
                    <TableCell key={day} align="center">
                      {schedules[day]?.map(schedule => (
                        <Box key={schedule.id}>
                          {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                        </Box>
                      )) || '-'}
                    </TableCell>
                  ))}
                  {!ref && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          onClick={() => onEdit(Object.values(schedules)[0][0])}
                          variant="outlined"
                          size="small"
                        >
                          Editar
                        </Button>
                        <Button 
                          onClick={() => onDelete(Object.values(schedules)[0][0].id)}
                          variant="contained"
                          color="error"
                          size="small"
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
});
