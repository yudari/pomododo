export interface Task {
    id: string;
    name: string;
    focusTime: number;
    shortBreak: number;
    longBreak: number;
    repeats: number;
    completedSessions: number;
    isCurrent: boolean;
}