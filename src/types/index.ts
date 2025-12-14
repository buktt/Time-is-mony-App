// App mode types
export type AppMode = 'personal' | 'business';

// Currency type
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Personal mode settings
export interface PersonalSettings {
  hourlyRate: number;
}

// Business mode participant
export interface Participant {
  id: string;
  name: string;
  hourlyRate: number;
}

// Custom label for grouping activities
export interface CustomLabel {
  id: string;
  name: string;
  color: string;
}

// Activity entry in the log
export interface ActivityEntry {
  id: string;
  mode: AppMode;
  activityName: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  amount: number;
  currency: string;
  labelId: string | null;
  participantIds?: string[];
  participantNames?: string[];
}

// Active timer session
export interface ActiveSession {
  startTime: number;
  activityName: string;
  labelId: string | null;
  participantIds?: string[];
}

// App state stored in localStorage
export interface AppState {
  mode: AppMode;
  currency: string;
  personalSettings: PersonalSettings;
  participants: Participant[];
  labels: CustomLabel[];
  activities: ActivityEntry[];
  activeSession: ActiveSession | null;
}

// Default currencies
export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

// Default label colors
export const LABEL_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

