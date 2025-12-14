import type { AppState, ActivityEntry, Participant, CustomLabel, AppMode } from '../types';

const STORAGE_KEY = 'time-is-money-state';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Default app state
const defaultState: AppState = {
  mode: 'personal',
  currency: 'USD',
  personalSettings: {
    hourlyRate: 0,
  },
  participants: [],
  labels: [],
  activities: [],
  activeSession: null,
};

// Load state from localStorage
export const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return defaultState;
};

// Save state to localStorage
export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

// Update specific parts of state
export const updateState = (updates: Partial<AppState>): AppState => {
  const currentState = loadState();
  const newState = { ...currentState, ...updates };
  saveState(newState);
  return newState;
};

// Mode operations
export const setMode = (mode: AppMode): AppState => {
  return updateState({ mode });
};

// Currency operations
export const setCurrency = (currency: string): AppState => {
  return updateState({ currency });
};

// Personal rate operations
export const setPersonalRate = (hourlyRate: number): AppState => {
  return updateState({ personalSettings: { hourlyRate } });
};

// Participant operations
export const addParticipant = (name: string, hourlyRate: number): AppState => {
  const state = loadState();
  const newParticipant: Participant = {
    id: generateId(),
    name,
    hourlyRate,
  };
  return updateState({ participants: [...state.participants, newParticipant] });
};

export const updateParticipant = (id: string, name: string, hourlyRate: number): AppState => {
  const state = loadState();
  const participants = state.participants.map((p) =>
    p.id === id ? { ...p, name, hourlyRate } : p
  );
  return updateState({ participants });
};

export const deleteParticipant = (id: string): AppState => {
  const state = loadState();
  const participants = state.participants.filter((p) => p.id !== id);
  return updateState({ participants });
};

// Label operations
export const addLabel = (name: string, color: string): AppState => {
  const state = loadState();
  const newLabel: CustomLabel = {
    id: generateId(),
    name,
    color,
  };
  return updateState({ labels: [...state.labels, newLabel] });
};

export const updateLabel = (id: string, name: string, color: string): AppState => {
  const state = loadState();
  const labels = state.labels.map((l) =>
    l.id === id ? { ...l, name, color } : l
  );
  return updateState({ labels });
};

export const deleteLabel = (id: string): AppState => {
  const state = loadState();
  const labels = state.labels.filter((l) => l.id !== id);
  // Also remove label from activities
  const activities = state.activities.map((a) =>
    a.labelId === id ? { ...a, labelId: null } : a
  );
  return updateState({ labels, activities });
};

// Activity operations
export const addActivity = (activity: Omit<ActivityEntry, 'id'>): AppState => {
  const state = loadState();
  const newActivity: ActivityEntry = {
    ...activity,
    id: generateId(),
  };
  return updateState({ 
    activities: [newActivity, ...state.activities],
    activeSession: null 
  });
};

export const deleteActivity = (id: string): AppState => {
  const state = loadState();
  const activities = state.activities.filter((a) => a.id !== id);
  return updateState({ activities });
};

export const updateActivityLabel = (id: string, labelId: string | null): AppState => {
  const state = loadState();
  const activities = state.activities.map((a) =>
    a.id === id ? { ...a, labelId } : a
  );
  return updateState({ activities });
};

// Session operations
export const startSession = (
  activityName: string,
  labelId: string | null,
  participantIds?: string[]
): AppState => {
  return updateState({
    activeSession: {
      startTime: Date.now(),
      activityName,
      labelId,
      participantIds,
    },
  });
};

export const endSession = (): AppState => {
  return updateState({ activeSession: null });
};
