import { useState, useCallback } from 'react';
import type { AppState, AppMode, ActiveSession } from '../types';
import * as storage from '../utils/storage';
import { calculateAmount, getDurationMinutes } from '../utils/calculations';

export const useAppState = () => {
  const [state, setState] = useState<AppState>(storage.loadState);

  // Reload state from storage
  const refreshState = useCallback(() => {
    setState(storage.loadState());
  }, []);

  // Mode
  const setMode = useCallback((mode: AppMode) => {
    const newState = storage.setMode(mode);
    setState(newState);
  }, []);

  // Currency
  const setCurrency = useCallback((currency: string) => {
    const newState = storage.setCurrency(currency);
    setState(newState);
  }, []);

  // Personal rate
  const setPersonalRate = useCallback((rate: number) => {
    const newState = storage.setPersonalRate(rate);
    setState(newState);
  }, []);

  // Participants
  const addParticipant = useCallback((name: string, hourlyRate: number) => {
    const newState = storage.addParticipant(name, hourlyRate);
    setState(newState);
  }, []);

  const updateParticipant = useCallback((id: string, name: string, hourlyRate: number) => {
    const newState = storage.updateParticipant(id, name, hourlyRate);
    setState(newState);
  }, []);

  const deleteParticipant = useCallback((id: string) => {
    const newState = storage.deleteParticipant(id);
    setState(newState);
  }, []);

  // Labels
  const addLabel = useCallback((name: string, color: string) => {
    const newState = storage.addLabel(name, color);
    setState(newState);
  }, []);

  const updateLabel = useCallback((id: string, name: string, color: string) => {
    const newState = storage.updateLabel(id, name, color);
    setState(newState);
  }, []);

  const deleteLabel = useCallback((id: string) => {
    const newState = storage.deleteLabel(id);
    setState(newState);
  }, []);

  // Activities
  const deleteActivity = useCallback((id: string) => {
    const newState = storage.deleteActivity(id);
    setState(newState);
  }, []);

  const updateActivityLabel = useCallback((id: string, labelId: string | null) => {
    const newState = storage.updateActivityLabel(id, labelId);
    setState(newState);
  }, []);

  // Session management
  const startSession = useCallback((
    activityName: string,
    labelId: string | null,
    participantIds?: string[]
  ) => {
    const newState = storage.startSession(activityName, labelId, participantIds);
    setState(newState);
  }, []);

  const finishSession = useCallback((activityNameOverride?: string) => {
    const currentState = storage.loadState();
    const session = currentState.activeSession;
    
    if (!session) return;

    const endTime = Date.now();
    const durationMinutes = getDurationMinutes(session.startTime, endTime);
    
    // Get hourly rate based on mode
    let hourlyRate = 0;
    let participantNames: string[] | undefined;
    
    if (currentState.mode === 'personal') {
      hourlyRate = currentState.personalSettings.hourlyRate;
    } else if (session.participantIds && session.participantIds.length > 0) {
      // Sum up all selected participants' rates
      const selectedParticipants = currentState.participants.filter(
        p => session.participantIds!.includes(p.id)
      );
      hourlyRate = selectedParticipants.reduce((sum, p) => sum + p.hourlyRate, 0);
      participantNames = selectedParticipants.map(p => p.name);
    }

    const amount = calculateAmount(durationMinutes, hourlyRate);

    // Use override name if provided, otherwise use session name
    const finalActivityName = activityNameOverride || session.activityName || 'Untitled Activity';

    const newState = storage.addActivity({
      mode: currentState.mode,
      activityName: finalActivityName,
      startTime: session.startTime,
      endTime,
      durationMinutes,
      amount,
      currency: currentState.currency,
      labelId: session.labelId,
      participantIds: session.participantIds,
      participantNames,
    });
    
    setState(newState);
  }, []);

  const cancelSession = useCallback(() => {
    const newState = storage.endSession();
    setState(newState);
  }, []);

  // Update session details (while running)
  const updateSession = useCallback((updates: Partial<ActiveSession>) => {
    const currentState = storage.loadState();
    if (currentState.activeSession) {
      const newState = storage.updateState({
        activeSession: { ...currentState.activeSession, ...updates }
      });
      setState(newState);
    }
  }, []);

  return {
    state,
    refreshState,
    setMode,
    setCurrency,
    setPersonalRate,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    addLabel,
    updateLabel,
    deleteLabel,
    deleteActivity,
    updateActivityLabel,
    startSession,
    finishSession,
    cancelSession,
    updateSession,
  };
};
