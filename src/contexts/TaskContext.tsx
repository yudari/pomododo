import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
    tasks: Task[];
    currentTask: Task | null;
    addTask: (name: string, focusTime: number, shortBreak: number, longBreak: number, repeats: number) => Task;
    updateTask: (id: string, updatedTask: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    setCurrentTask: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem('pomodoroTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [currentTask, setCurrentTaskState] = useState<Task | null>(() => {
        const savedCurrentTaskId = localStorage.getItem('pomodoroCurrentTask');
        const savedTasks = localStorage.getItem('pomodoroTasks');
        if (savedCurrentTaskId && savedTasks) {
            const parsedTasks: Task[] = JSON.parse(savedTasks);
            return parsedTasks.find(task => task.id === savedCurrentTaskId) || null;
        }
        return null;
    });

    useEffect(() => {
        localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        if (currentTask) {
            localStorage.setItem('pomodoroCurrentTask', currentTask.id);
        } else {
            localStorage.removeItem('pomodoroCurrentTask');
        }
    }, [currentTask]);

    const addTask = (name: string, focusTime: number, shortBreak: number, longBreak: number, repeats: number) => {
        const newTask: Task = {
            id: uuidv4(),
            name,
            focusTime,
            shortBreak,
            longBreak,
            repeats,
            completedSessions: 0,
            isCurrent: false,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        return newTask;
    };

    const updateTask = (id: string, updatedTask: Partial<Task>) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
        );
        if (currentTask && currentTask.id === id) {
            setCurrentTaskState((prev) => (prev ? { ...prev, ...updatedTask } : null));
        }
    };

    const deleteTask = (id: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        if (currentTask && currentTask.id === id) {
            setCurrentTaskState(null);
        }
    };

    const setCurrentTask = (id: string | null) => {
        if (id === null) {
            setCurrentTaskState(null);
            setTasks((prevTasks) => prevTasks.map(task => ({ ...task, isCurrent: false })));
        } else {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, isCurrent: true } : { ...task, isCurrent: false }
                )
            );
            setCurrentTaskState(tasks.find(task => task.id === id) || null);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, currentTask, addTask, updateTask, deleteTask, setCurrentTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};