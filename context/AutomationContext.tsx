import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Progress {
  done: number;
  total: number;
}

interface AutomationContextType {
  dates: string[];
  setDates: (dates: string[]) => void;
  dateGoals: Record<string, number>;
  setDateGoals: (goals: Record<string, number>) => void;
  numbers: string[];
  setNumbers: (numbers: string[]) => void;
  setNumbersFromText: (text: string) => void;
  delayMs: number;
  setDelayMs: (delay: number) => void;
  startIndex: number;
  setStartIndex: (index: number) => void;
  status: string;
  setStatus: (status: string) => void;
  progress: Progress;
  updateProgress: (done: number, total: number) => void;
  dateIndex: number;
  setDateIndex: (index: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  isLoading: boolean;
  addDate: (date: string, goal: number | string) => void;
  removeDate: (index: number) => void;
  startAutomation: () => void;
  pauseAutomation: () => void;
  resumeAutomation: () => void;
  stopAutomation: () => void;
  nextDate: () => void;
  clearSettings: () => Promise<void>;
}

export const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

interface AutomationProviderProps {
  children: ReactNode;
}

export const AutomationProvider: React.FC<AutomationProviderProps> = ({ children }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [dateGoals, setDateGoals] = useState<Record<string, number>>({});
  const [numbers, setNumbers] = useState<string[]>([]);
  const [delayMs, setDelayMs] = useState(1200);
  const [startIndex, setStartIndex] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 0 });
  const [dateIndex, setDateIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.multiGet([
          'tanggal',
          'dateGoals',
          'numbers',
          'delayMs',
          'progress',
          'dateIndex',
          'startIndex',
        ]);

        const data: Record<string, any> = {};
        stored.forEach(([key, value]) => {
          data[key] = value ? JSON.parse(value) : null;
        });

        if (Array.isArray(data.tanggal)) setDates(data.tanggal);
        if (data.dateGoals) setDateGoals(data.dateGoals);
        if (Array.isArray(data.numbers)) setNumbers(data.numbers);
        if (data.delayMs) setDelayMs(data.delayMs);
        if (data.dateIndex) setDateIndex(data.dateIndex);
        if (data.startIndex) setStartIndex(data.startIndex);
        if (data.progress) {
          setProgress(data.progress);
          setStatus(data.progress.status || 'Idle');
        }
        
        console.log('✓ Settings loaded from storage');
      } catch (error) {
        console.error('Failed to load state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Save state to AsyncStorage
  const saveState = useCallback(async () => {
    try {
      await AsyncStorage.multiSet([
        ['tanggal', JSON.stringify(dates)],
        ['dateGoals', JSON.stringify(dateGoals)],
        ['numbers', JSON.stringify(numbers)],
        ['delayMs', JSON.stringify(delayMs)],
        ['progress', JSON.stringify(progress)],
        ['dateIndex', JSON.stringify(dateIndex)],
        ['startIndex', JSON.stringify(startIndex)],
      ]);
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [dates, dateGoals, numbers, delayMs, progress, dateIndex, startIndex]);

  useEffect(() => {
    saveState();
  }, [dates, dateGoals, numbers, delayMs, progress, dateIndex, startIndex, saveState]);

  const addDate = useCallback((date: string, goal: number | string) => {
    if (!dates.includes(date)) {
      setDates([...dates, date]);
      setDateGoals({ ...dateGoals, [date]: parseInt(String(goal), 10) });
    }
  }, [dates, dateGoals]);

  const removeDate = useCallback((index: number) => {
    const dateToRemove = dates[index];
    const newDates = dates.filter((_, i) => i !== index);
    const newGoals = { ...dateGoals };
    delete newGoals[dateToRemove];
    setDates(newDates);
    setDateGoals(newGoals);
  }, [dates, dateGoals]);

  const setNumbersFromText = useCallback((text: string) => {
    const nums = text
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    setNumbers(nums);
  }, []);

  const startAutomation = useCallback(() => {
    if (numbers.length === 0 || dates.length === 0) {
      setStatus('Error: Please add numbers and dates');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setProgress({ done: startIndex, total: numbers.length });
    setStatus(`Running on ${dates[dateIndex] || dates[0]}`);
    setDateIndex(0);
  }, [numbers, dates, dateIndex, startIndex]);

  const pauseAutomation = useCallback(() => {
    setIsPaused(true);
    setStatus('Paused');
  }, []);

  const resumeAutomation = useCallback(() => {
    if (isRunning) {
      setIsPaused(false);
      setStatus(`Running on ${dates[dateIndex] || dates[0]}`);
    }
  }, [isRunning, dates, dateIndex]);

  const stopAutomation = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setStatus('Idle');
    setProgress({ done: 0, total: 0 });
  }, []);

  const nextDate = useCallback(() => {
    if (dateIndex < dates.length - 1) {
      setDateIndex(dateIndex + 1);
      setProgress({ ...progress, done: 0 });
      setStatus(`Running on ${dates[dateIndex + 1]}`);
    } else {
      setStatus('All dates completed');
      setIsRunning(false);
    }
  }, [dateIndex, dates, progress]);

  const updateProgress = useCallback((done: number, total: number) => {
    setProgress({ done, total });
  }, []);

  const clearSettings = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        'tanggal',
        'dateGoals',
        'numbers',
        'delayMs',
        'progress',
        'dateIndex',
        'startIndex',
      ]);
      
      // Reset state
      setDates([]);
      setDateGoals({});
      setNumbers([]);
      setDelayMs(1200);
      setStartIndex(0);
      setStatus('Idle');
      setProgress({ done: 0, total: 0 });
      setDateIndex(0);
      setIsRunning(false);
      setIsPaused(false);
      
      console.log('✓ Settings cleared');
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  }, []);

  const value: AutomationContextType = {
    dates,
    setDates,
    dateGoals,
    setDateGoals,
    numbers,
    setNumbers,
    setNumbersFromText,
    delayMs,
    setDelayMs,
    startIndex,
    setStartIndex,
    status,
    setStatus,
    progress,
    updateProgress,
    dateIndex,
    setDateIndex,
    isRunning,
    isPaused,
    isLoading,
    addDate,
    removeDate,
    startAutomation,
    pauseAutomation,
    resumeAutomation,
    stopAutomation,
    nextDate,
    clearSettings,
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};
