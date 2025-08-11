import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types/task';

interface EditTaskModalProps {
    task: Task | null;
    onClose: () => void;
    onAddTask: (name: string, focusTime: number, shortBreak: number, longBreak: number, repeats: number) => Promise<void>;
    scheduleInCalendar: boolean;
    setScheduleInCalendar: (value: boolean) => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Title = styled.h2`
  font-size: 2em;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const Label = styled.label`
  font-size: 1em;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1em;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1em;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const ApplyButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onAddTask, scheduleInCalendar, setScheduleInCalendar }) => {
    const { updateTask, setCurrentTask } = useTasks();
    const [name, setName] = useState(task?.name || '');
    const [focusTime, setFocusTime] = useState(task?.focusTime || 25);
    const [shortBreak, setShortBreak] = useState(task?.shortBreak || 5);
    const [longBreak, setLongBreak] = useState(task?.longBreak || 15);
    const [repeats, setRepeats] = useState(task?.repeats || 4);
    const [isCurrent, setIsCurrent] = useState(task?.isCurrent || false);

    useEffect(() => {
        if (task) {
            setName(task.name);
            setFocusTime(task.focusTime);
            setShortBreak(task.shortBreak);
            setLongBreak(task.longBreak);
            setRepeats(task.repeats);
            setIsCurrent(task.isCurrent);
        } else {
            // Reset form for new task
            setName('');
            setFocusTime(25);
            setShortBreak(5);
            setLongBreak(15);
            setRepeats(4);
            setIsCurrent(false);
        }
    }, [task]);

    const handleSubmit = async () => {
        if (task) {
            updateTask(task.id, { name, focusTime, shortBreak, longBreak, repeats });
            if (isCurrent) {
                setCurrentTask(task.id);
            } else if (task.isCurrent && !isCurrent) {
                setCurrentTask(null);
            }
        } else {
            await onAddTask(name, focusTime, shortBreak, longBreak, repeats);
            // The onAddTask function now handles setting the current task if needed
        }
        onClose();
    };

    return (
        <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ModalContent
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
                <CloseButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={onClose}>
                    &times;
                </CloseButton>
                <Title>{task ? 'Edit Task' : 'Add New Task'}</Title>

                <InputGroup>
                    <Label htmlFor="taskName">Task name</Label>
                    <Input
                        id="taskName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="focusTime">Focus time (minutes)</Label>
                    <Input
                        id="focusTime"
                        type="number"
                        value={focusTime}
                        onChange={(e) => setFocusTime(parseInt(e.target.value))}
                        min="1"
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="shortBreak">Short break (minutes)</Label>
                    <Input
                        id="shortBreak"
                        type="number"
                        value={shortBreak}
                        onChange={(e) => setShortBreak(parseInt(e.target.value))}
                        min="1"
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="longBreak">Long break (minutes)</Label>
                    <Input
                        id="longBreak"
                        type="number"
                        value={longBreak}
                        onChange={(e) => setLongBreak(parseInt(e.target.value))}
                        min="1"
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="repeats">Repeats until long break</Label>
                    <Input
                        id="repeats"
                        type="number"
                        value={repeats}
                        onChange={(e) => setRepeats(parseInt(e.target.value))}
                        min="1"
                    />
                </InputGroup>

                <CheckboxGroup>
                    <Checkbox
                        id="isCurrent"
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <Label htmlFor="isCurrent">Set as Current Task</Label>
                </CheckboxGroup>

                {!task && ( // Only show for new tasks
                    <CheckboxGroup>
                        <Checkbox
                            id="scheduleInCalendar"
                            type="checkbox"
                            checked={scheduleInCalendar}
                            onChange={(e) => setScheduleInCalendar(e.target.checked)}
                        />
                        <Label htmlFor="scheduleInCalendar">Schedule in Google Calendar</Label>
                    </CheckboxGroup>
                )}

                <ApplyButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit}>
                    Apply
                </ApplyButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditTaskModal;