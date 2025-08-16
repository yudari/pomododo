import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes, NavLink as RouterNavLink } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import { CalendarProvider } from './contexts/CalendarContext';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/TimerPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import { FaTasks, FaClock, FaCog, FaCalendarAlt } from 'react-icons/fa';

// Define themes
const themes = {
  light: {
    background: '#f0f2f5',
    text: '#333',
    primary: '#4CAF50',
    secondary: '#FFC107',
    cardBackground: '#fff',
    borderColor: '#ddd',
  },
  dark: {
    background: '#282c34',
    text: '#f0f2f5',
    primary: '#66BB6A',
    secondary: '#FFD54F',
    cardBackground: '#3a3f47',
    borderColor: '#555',
  },
  blue: {
    background: '#e0f2f7',
    text: '#1a2a3a',
    primary: '#2196F3',
    secondary: '#90CAF9',
    cardBackground: '#ffffff',
    borderColor: '#b3e5fc',
  },
  purple: {
    background: '#f3e5f5',
    text: '#3a1a3a',
    primary: '#9C27B0',
    secondary: '#CE93D8',
    cardBackground: '#ffffff',
    borderColor: '#e1bee7',
  },
  red: {
    background: '#ffebee',
    text: '#3a1a1a',
    primary: '#F44336',
    secondary: '#EF9A9A',
    cardBackground: '#ffffff',
    borderColor: '#ffcdd2',
  },
  green: {
    background: '#e8f5e9',
    text: '#1a3a1a',
    primary: '#4CAF50',
    secondary: '#A5D6A7',
    cardBackground: '#ffffff',
    borderColor: '#c8e6c9',
  },
  orange: {
    background: '#fff3e0',
    text: '#3a2a1a',
    primary: '#FF9800',
    secondary: '#FFCC80',
    cardBackground: '#ffffff',
    borderColor: '#ffe0b2',
  },
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Poppins', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;

const AppContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px; /* Adjust as needed for desired maximum width */
  @media (max-width: 768px) {
    width: 100%;
  }
  padding: 0px;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.3s ease;
`;

const MainContent = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Navbar = styled(motion.nav)`
  background-color: ${({ theme }) => theme.cardBackground};
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  @media (min-width: 769px) {
    position: static;
    margin-top: 30px;
    border-top: none;
    box-shadow: none;
    width: 100vh;
    border-radius: 20px;
    padding: 15px 30px;
  }
`;

const NavLink = styled(RouterNavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: 0.9em;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  svg {
    font-size: 1.5em;
    margin-bottom: 5px;
  }

  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

const App: React.FC = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <TaskProvider>
        <CalendarProvider>
          <Router>
            <AppContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MainContent>
                <Routes>
                  <Route path="/" element={<TimerPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/settings" element={<SettingsPage setTheme={setTheme} currentThemeName={theme} availableThemes={Object.keys(themes)} />} />
                </Routes>
              </MainContent>

              <Navbar
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 10 }}
              >
                <NavLink to="/tasks">
                  <FaTasks />
                  Tasks
                </NavLink>
                <NavLink to="/">
                  <FaClock />
                  Timer
                </NavLink>
                <NavLink to="/calendar">
                  <FaCalendarAlt />
                  Calendar
                </NavLink>
                <NavLink to="/settings">
                  <FaCog />
                  Settings
                </NavLink>
              </Navbar>
            </AppContainer>
          </Router>
        </CalendarProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
