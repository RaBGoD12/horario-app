import React, { useState, useRef } from 'react';
import { useSchedule } from './hooks/useSchedule'; // Ruta del hook useSchedule
import { ScheduleForm } from './components/ScheduleForm'; // Formulario para gestionar horarios
import { ScheduleTable } from './components/ScheduleTable'; // Tabla de horarios
import { exportTableAsImage } from './utils/exportUtils'; // Exportar tabla como imagen
import {
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';

export default function App() {
  // Hook para los horarios
  const { 
    schedules, 
    employees, 
    roles, 
    loading, 
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule 
  } = useSchedule();

  // Estado y referencia para el formulario
  const [editMode, setEditMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    employee_id: '',
    role_id: '',
    start_time: '',
    end_time: '',
    day: '',
  });
  const tableRef = useRef(null);

  // Manejar la sumisión del formulario de horarios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateSchedule(currentSchedule.id, currentSchedule);
      } else {
        await addSchedule(currentSchedule);
      }
      setEditMode(false);
      setCurrentSchedule({
        employee_id: '',
        role_id: '',
        start_time: '',
        end_time: '',
        day: '',
      });
    } catch (error) {
      console.error('Error managing schedule:', error);
    }
  };

  const handleEdit = (schedule) => {
    setEditMode(true);
    setCurrentSchedule(schedule);
  };

  const handleExport = async () => {
    await exportTableAsImage(tableRef);
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '1152px', // Equivalente a max-w-6xl
        mx: 'auto',
        p: 3,
      }}
    >
      <Box mb={3}>
        <Typography variant="h5" component="h2">
          Gestor de Horarios
        </Typography>
      </Box>
      
      {/* Formulario de horarios */}
      <ScheduleForm
        currentSchedule={currentSchedule}
        setCurrentSchedule={setCurrentSchedule}
        onSubmit={handleSubmit}
        employees={employees}
        roles={roles}
        editMode={editMode}
      />

      {/* Exportar la tabla */}
      <Box mt={2}>
        <Button 
          variant="contained"
          onClick={handleExport}
          sx={{ ml: 2 }}
        >
          Exportar Horarios
        </Button>
      </Box>

      {/* Tabla de horarios */}
      <ScheduleTable
        ref={tableRef}
        schedules={schedules}
        employees={employees}
        onEdit={handleEdit}
        onDelete={deleteSchedule}
      />
    </Paper>
  );
}
