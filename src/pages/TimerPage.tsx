import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTasks } from '../contexts/TaskContext';

const TimerPageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

const PomodoroCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const TimerDisplay = styled(motion.div)`
  font-size: 5em;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 4em;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Button = styled(motion.button)`
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1em;
  }
`;

const ProgressTracker = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  text-align: left;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.borderColor};
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 10px;
`;

type TimerType = 'work' | 'shortBreak' | 'longBreak';

const TimerPage: React.FC = () => {
    const { currentTask, updateTask } = useTasks();
    const [timer, setTimer] = useState<number>(() => {
        const savedTimer = localStorage.getItem('pomodoroTimer');
        return savedTimer ? parseInt(savedTimer) : (currentTask?.focusTime || 25) * 60;
    });
    const [timerType, setTimerType] = useState<TimerType>(() => {
        const savedTimerType = localStorage.getItem('pomodoroTimerType');
        return (savedTimerType as TimerType) || 'work';
    });
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        // Initialize timer when currentTask or timerType changes, or on component mount
        // Do not reset timer when pausing/resuming
        const initialTimerValue = () => {
            if (currentTask) {
                if (timerType === 'work') {
                    return currentTask.focusTime * 60;
                } else if (timerType === 'shortBreak') {
                    return currentTask.shortBreak * 60;
                } else if (timerType === 'longBreak') {
                    return currentTask.longBreak * 60;
                }
            }
            return 25 * 60; // Default if no current task
        };

        // Only set timer if it's currently 0 (e.g., after a session completes) or if it's the initial load
        // This prevents resetting the timer when pausing
        if (timer === 0 || !isRunning) { // Check if timer is 0 or not running (initial load/reset)
            const savedTimer = localStorage.getItem('pomodoroTimer');
            if (savedTimer && parseInt(savedTimer) > 0 && !isRunning) {
                setTimer(parseInt(savedTimer));
            } else {
                setTimer(initialTimerValue());
            }
        }
    }, [currentTask, timerType]); // Removed isRunning from dependencies

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        const beepSound = new Audio('/ticking-clock.mp3');
        beepSound.loop = true; // Loop the sound

        if (isRunning && timer > 0) {
            beepSound.play(); // Play sound when timer starts
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (!isRunning) {
            beepSound.pause(); // Pause sound when timer is paused
            beepSound.currentTime = 0; // Reset sound to beginning
        }

        if (timer === 0 && isRunning) { // Only trigger completion logic if timer reached 0 while running
            setIsRunning(false);
            beepSound.pause(); // Stop sound when timer reaches 0
            beepSound.currentTime = 0; // Reset sound to beginning
            if (timerType === 'work') {
                if (currentTask) {
                    updateTask(currentTask.id, { completedSessions: currentTask.completedSessions + 1 });
                    if ((currentTask.completedSessions + 1) % currentTask.repeats === 0) {
                        setTimerType('longBreak');
                    } else {
                        setTimerType('shortBreak');
                    }
                } else {
                    setTimerType('shortBreak'); // Fallback if no current task
                }
            } else {
                setTimerType('work');
            }
            // Reset timer for the next session type
            setTimer((prevTimer) => {
                if (timerType === 'work') {
                    return (currentTask?.shortBreak || 5) * 60;
                } else if (timerType === 'shortBreak') {
                    return (currentTask?.focusTime || 25) * 60;
                } else if (timerType === 'longBreak') {
                    return (currentTask?.focusTime || 25) * 60;
                }
                return prevTimer;
            });
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            beepSound.pause(); // Ensure sound stops on component unmount
            beepSound.currentTime = 0;
        };
    }, [isRunning, timer, timerType, currentTask, updateTask]);

    // Save timer state to localStorage whenever timer or timerType changes
    useEffect(() => {
        localStorage.setItem('pomodoroTimer', timer.toString());
        localStorage.setItem('pomodoroTimerType', timerType);
    }, [timer, timerType]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setTimerType('work');
        setTimer((currentTask?.focusTime || 25) * 60);
        localStorage.setItem('pomodoroTimer', ((currentTask?.focusTime || 25) * 60).toString());
        localStorage.setItem('pomodoroTimerType', 'work');
    };

    const progressPercentage = currentTask
        ? (currentTask.completedSessions / currentTask.repeats) * 100
        : 0;

    return (
        <TimerPageContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <PomodoroCard
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
                <Title>Pomodoro Timer</Title>
                {currentTask && <p>Current Task: {currentTask.name}</p>}
                <TimerDisplay
                    key={timer}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    {formatTime(timer)}
                </TimerDisplay>

                <ButtonGroup>
                    <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startTimer} disabled={isRunning}>
                        Start
                    </Button>
                    <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={pauseTimer} disabled={!isRunning}>
                        Pause
                    </Button>
                    <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetTimer}>
                        Reset
                    </Button>
                </ButtonGroup>

                <ProgressTracker>
                    <h2>Progress</h2>
                    <p>Sessions Completed for Current Task: {currentTask?.completedSessions || 0}/{currentTask?.repeats || 0}</p>
                    <ProgressBarContainer>
                        <ProgressBar
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </ProgressBarContainer>
                </ProgressTracker>
            </PomodoroCard>
        </TimerPageContainer>
    );
};

export default TimerPage;