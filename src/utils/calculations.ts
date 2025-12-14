import { CURRENCIES } from '../types';

// Format duration from minutes to human readable
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

// Format elapsed time (from milliseconds)
export const formatElapsedTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

// Calculate earnings/cost from duration and hourly rate
export const calculateAmount = (durationMinutes: number, hourlyRate: number): number => {
  return (durationMinutes / 60) * hourlyRate;
};

// Format amount with currency symbol
export const formatAmount = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  return `${symbol}${amount.toFixed(2)}`;
};

// Get duration in minutes from start and end timestamps
export const getDurationMinutes = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000 / 60;
};

