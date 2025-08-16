import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CalendarContextType {
    // Define any shared state or functions related to the calendar here
    // For FullCalendar, most interactions will be directly with the component
    // or through its API, so this context might be minimal or focused on data.
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // No authentication state needed here for a generic calendar context
    // FullCalendar handles its own event sources and interactions.

    return (
        <CalendarContext.Provider value={{ /* provide any context values here */ }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};