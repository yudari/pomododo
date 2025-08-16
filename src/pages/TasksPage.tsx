import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTasks } from '../contexts/TaskContext';
import { useCalendar } from '../contexts/CalendarContext';
import type { Task } from '../types/task';
import { FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import EditTaskModal from '../components/EditTaskModal'; // Will create this next
import { AnimatePresence } from 'framer-motion';

const TasksPageContainer = styled(motion.div)`
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: ${({ theme }) => theme.text};
`;

const AddButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const TaskSection = styled.div`
  margin-bottom: 30px;
  max-height: 300px;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8em;
  color: ${({ theme }) => theme.text};
  margin-bottom: 15px;
  text-align: left;
`;

const TaskCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskName = styled.h3`
  font-size: 1.4em;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 1.2em;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const TaskDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 10px;
`;

const NoTasksMessage = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  text-align: center;
  margin-top: 50px;
`;

const TasksPage: React.FC = () => {
    const { tasks, currentTask, deleteTask, setCurrentTask, addTask } = useTasks();
    // const { createCalendarEvent } = useCalendar(); // This functionality will be removed or re-implemented with FullCalendar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [scheduleInCalendar, setScheduleInCalendar] = useState(false);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleAddNewTask = () => {
        setEditingTask(null); // Clear any previous editing task
        setIsModalOpen(true);
    };

    const handleAddTask = async (taskName: string, focusTime: number, shortBreak: number, longBreak: number, repeats: number, scheduledDate: string | null, scheduledTime: string | null, scheduleInCalendar: boolean) => {
        addTask(taskName, focusTime, shortBreak, longBreak, repeats, scheduledDate, scheduledTime);

        // FullCalendar integration for event creation will be handled differently,
        // likely through a separate component or direct FullCalendar API calls.
        // The `scheduleInCalendar` logic will need to be re-evaluated based on
        // how FullCalendar is integrated into the application.
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const otherTasks = tasks.filter(task => task.id !== currentTask?.id);

    return (
        <TasksPageContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header>
                <Title>Tasks</Title>
                <AddButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleAddNewTask}>
                    <FaPlus />
                </AddButton>
            </Header>

            <TaskSection>
                <SectionTitle>Current Task</SectionTitle>
                {currentTask ? (
                    <TaskCard
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    >
                        <TaskHeader>
                            <TaskName>{currentTask.name}</TaskName>
                            <TaskActions>
                                <ActionButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(currentTask)}>
                                    <FaEdit />
                                </ActionButton>
                                <ActionButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => deleteTask(currentTask.id)}>
                                    <FaTimes />
                                </ActionButton>
                            </TaskActions>
                        </TaskHeader>
                        <TaskDetails>
                            <span>{currentTask.focusTime} min</span>
                            <span>{currentTask.completedSessions}/{currentTask.repeats}</span>
                            <span>{currentTask.focusTime * currentTask.repeats} min</span>
                        </TaskDetails>
                        <ProgressBarContainer>
                            <ProgressBar
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentTask.completedSessions / currentTask.repeats) * 100}%` }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            />
                        </ProgressBarContainer>
                    </TaskCard>
                ) : (
                    <NoTasksMessage>No current task. Add a new task or set one as current.</NoTasksMessage>
                )}
            </TaskSection>

            <TaskSection>
                <SectionTitle>Other Tasks</SectionTitle>
                {otherTasks.length === 0 ? (
                    <NoTasksMessage>No other tasks.</NoTasksMessage>
                ) : (
                    otherTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                            onClick={() => setCurrentTask(task.id)}
                        >
                            <TaskHeader>
                                <TaskName>{task.name}</TaskName>
                                <TaskActions>
                                    <ActionButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleEdit(task); }}>
                                        <FaEdit />
                                    </ActionButton>
                                    <ActionButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
                                        <FaTimes />
                                    </ActionButton>
                                </TaskActions>
                            </TaskHeader>
                            <TaskDetails>
                                <span>{task.focusTime} min</span>
                                <span>{task.completedSessions}/{task.repeats}</span>
                                <span>{task.focusTime * task.repeats} min</span>
                            </TaskDetails>
                            <ProgressBarContainer>
                                <ProgressBar
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(task.completedSessions / task.repeats) * 100}%` }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </ProgressBarContainer>
                        </TaskCard>
                    ))
                )}
            </TaskSection>

            <AnimatePresence>
                {isModalOpen && (
                    <EditTaskModal
                        task={editingTask}
                        onClose={handleCloseModal}
                        onAddTask={(taskName, focusTime, shortBreak, longBreak, repeats, scheduledDate, scheduledTime) => handleAddTask(taskName, focusTime, shortBreak, longBreak, repeats, scheduledDate, scheduledTime, scheduleInCalendar)}
                        scheduleInCalendar={scheduleInCalendar}
                        setScheduleInCalendar={setScheduleInCalendar}
                    />
                )}
            </AnimatePresence>
        </TasksPageContainer>
    );
};

export default TasksPage;