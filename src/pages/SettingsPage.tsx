import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// import { useGoogleCalendar } from '../contexts/GoogleCalendarContext'; // Removed as Google Calendar integration is being replaced

const SettingsPageContainer = styled(motion.div)`
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 30px;
`;

const SettingsSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingItem = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 80px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1em;
  text-align: center;
`;

const ToggleButton = styled(motion.button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1em;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

interface Settings {
    work: number;
    shortBreak: number;
    longBreak: number;
}

interface SettingsPageProps {
    setTheme: (themeName: string) => void;
    currentThemeName: string;
    availableThemes: string[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ setTheme, currentThemeName, availableThemes }) => {
    // const { isAuthenticated, signIn, signOut } = useGoogleCalendar(); // Removed as Google Calendar integration is being replaced
    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = localStorage.getItem('pomododoSettings');
        return savedSettings ? JSON.parse(savedSettings) : { work: 25, shortBreak: 5, longBreak: 15 };
    });

    useEffect(() => {
        localStorage.setItem('pomododoSettings', JSON.stringify(settings));
    }, [settings]);

    const handleSettingChange = (type: keyof Settings, value: number) => {
        setSettings((prev) => ({ ...prev, [type]: value }));
    };

    return (
        <SettingsPageContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Title>Settings</Title>
            <SettingsSection>
                <SettingItem>
                    Work Duration (minutes):
                    <Input
                        type="number"
                        value={settings.work}
                        onChange={(e) => handleSettingChange('work', parseInt(e.target.value))}
                        min="1"
                    />
                </SettingItem>
                <SettingItem>
                    Short Break (minutes):
                    <Input
                        type="number"
                        value={settings.shortBreak}
                        onChange={(e) => handleSettingChange('shortBreak', parseInt(e.target.value))}
                        min="1"
                    />
                </SettingItem>
                <SettingItem>
                    Long Break (minutes):
                    <Input
                        type="number"
                        value={settings.longBreak}
                        onChange={(e) => handleSettingChange('longBreak', parseInt(e.target.value))}
                        min="1"
                    />
                </SettingItem>
            </SettingsSection>

            <SettingsSection style={{ marginTop: '20px' }}>
                <h2>Theme Settings</h2>
                <SettingItem>
                    Choose Theme:
                    <select
                        value={currentThemeName}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{
                            padding: '8px',
                            borderRadius: '5px',
                            border: `1px solid ${currentThemeName === 'light' ? '#ddd' : '#555'}`,
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            fontSize: '1em',
                        }}
                    >
                        {availableThemes.map((themeName) => (
                            <option key={themeName} value={themeName}>
                                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                            </option>
                        ))}
                    </select>
                </SettingItem>
            </SettingsSection>
        </SettingsPageContainer>
    );
};

export default SettingsPage;