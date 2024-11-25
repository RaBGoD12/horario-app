// src/hooks/useSchedule.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useSchedule } from './useSchedule';
import { supabase } from '../config/supabaseClient';

// Mock supabase client
jest.mock('../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}));

const mockData = {
  schedules: [{ id: 1, employee_id: 1, role: 'dev' }],
  employees: [{ id: 1, name: 'John' }],
  roles: [{ id: 1, name: 'dev' }]
};

describe('useSchedule', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default successful responses
    supabase.from.mockImplementation((table) => ({
      select: () => Promise.resolve({ 
        data: mockData[table],
        error: null 
      }),
      insert: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null }),
      eq: () => Promise.resolve({ error: null })
    }));
  });

  test('should initialize with default values', async () => {
    const { result } = renderHook(() => useSchedule());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.schedules).toEqual([]);
    expect(result.current.employees).toEqual([]);
    expect(result.current.roles).toEqual([]);
  });

  test('should fetch data on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSchedule());
    
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.schedules).toEqual(mockData.schedules);
    expect(result.current.employees).toEqual(mockData.employees);
    expect(result.current.roles).toEqual(mockData.roles);
  });

  test('should handle add schedule', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSchedule());
    await waitForNextUpdate();

    const newSchedule = { employee_id: 1, role: 'dev' };
    
    await act(async () => {
      await result.current.addSchedule(newSchedule);
    });

    expect(supabase.from).toHaveBeenCalledWith('schedules');
  });

  test('should handle update schedule', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSchedule());
    await waitForNextUpdate();

    const updatedSchedule = { id: 1, employee_id: 1, role: 'senior dev' };
    
    await act(async () => {
      await result.current.updateSchedule(1, updatedSchedule);
    });

    expect(supabase.from).toHaveBeenCalledWith('schedules');
  });

  test('should handle delete schedule', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSchedule());
    await waitForNextUpdate();

    await act(async () => {
      await result.current.deleteSchedule(1);
    });

    expect(supabase.from).toHaveBeenCalledWith('schedules');
  });

  test('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch';
    supabase.from.mockImplementation(() => ({
      select: () => Promise.resolve({ error: new Error(errorMessage) })
    }));

    const { result, waitForNextUpdate } = renderHook(() => useSchedule());
    await waitForNextUpdate();

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });
});
