export interface Task {
    id: string;
    name: string;
    focusTime: number;
    shortBreak: number;
    longBreak: number;
    repeats: number;
    completedSessions: number;
    isCurrent: boolean;
    scheduledDate?: string; // YYYY-MM-DD
    scheduledTime?: string; // HH:MM
    status?: 'pending' | 'completed' | 'overdue';
}