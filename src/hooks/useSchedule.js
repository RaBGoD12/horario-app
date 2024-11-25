import { useState, useEffect } from 'react';
import axios from 'axios';
import {supabase}  from '../config/supabaseClient'; // Changed from './config/supabaseClient'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Custom hook that uses both Axios and Supabase
export const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with Supabase config
  const axiosSupabase = axios.create({
    baseURL: SUPABASE_URL,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch initial data
      const [schedulesRes, rolesRes, employeesRes] = await Promise.all([
        supabase.from('schedules').select('*'),
        supabase.from('roles').select('*'),
        supabase.from('employees').select('*')
      ]);

      if (schedulesRes.error) throw schedulesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (employeesRes.error) throw employeesRes.error;

      setSchedules(schedulesRes.data);
      setRoles(rolesRes.data);
      setEmployees(employeesRes.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (newSchedule) => {
    try {
      await axiosSupabase.post('/rest/v1/schedules', newSchedule);
      await fetchData();
    } catch (error) {
      throw error;
    }
  };

  const updateSchedule = async (id, updatedSchedule) => {
    try {
      await axiosSupabase.patch(`/rest/v1/schedules?id=eq.${id}`, updatedSchedule);
      await fetchData();
    } catch (error) {
      throw error;
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await axiosSupabase.delete(`/rest/v1/schedules?id=eq.${id}`);
      await fetchData();
    } catch (error) {
      throw error;
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    const subscription = supabase
      .channel('schedule-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schedules'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    schedules,
    employees,
    roles,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    refreshData: fetchData
  };
};
