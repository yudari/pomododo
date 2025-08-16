import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTasks } from '../contexts/TaskContext';

const CalendarPageContainer = styled(motion.div)`
  padding: 20px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: ${({ theme }) => theme.text};
  margin-bottom: 30px;
  text-align: center;
`;

const CalendarWrapper = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.borderColor};
  max-height: calc(90vh - 200px); /* Adjust as needed to leave space for navbar */
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  .fc .fc-button-primary {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;

    &:hover {
      background-color: ${({ theme }) => theme.secondary};
      border-color: ${({ theme }) => theme.secondary};
    }
  }

  .fc-event {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;
  }

  .overdue-event {
    background-color: red !important;
    border-color: darkred !important;
  }

  .completed-event {
    background-color: green !important;
    border-color: darkgreen !important;
  }

  .fc-daygrid-day-number {
    color: ${({ theme }) => theme.text};
  }

  .fc-col-header-cell-cushion {
    color: ${({ theme }) => theme.text};
  }

`;

// Custom event content rendering
function renderEventContent(eventInfo: any) {
  const time = eventInfo.event.extendedProps.scheduledTime;
  let formattedTime = '';
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  return (
    <>
      <b>{formattedTime}</b>-
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const CalendarPage: React.FC = () => {
  const { tasks, updateTask } = useTasks();

  useEffect(() => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.scheduledDate && task.status === 'pending') {
        const scheduledDateTime = new Date(`${task.scheduledDate}T${task.scheduledTime || '23:59:59'}`);
        if (scheduledDateTime < now) {
          console.log(`Task "${task.name}" (ID: ${task.id}) is overdue. Updating status.`);
          updateTask(task.id, { status: 'overdue' });
        }
      }
    });
  }, [tasks, updateTask]);

  const events = tasks
    .filter(task => task.scheduledDate)
    .map(task => {
      const eventClassNames = [];
      console.log(`Task: ${task.name}, Status: ${task.status}`);
      if (task.status === 'overdue') {
        eventClassNames.push('overdue-event');
      } else if (task.status === 'completed') {
        eventClassNames.push('completed-event');
      }

      return {
        title: task.name,
        start: task.scheduledDate + (task.scheduledTime ? `T${task.scheduledTime}` : ''),
        allDay: !task.scheduledTime,
        classNames: eventClassNames,
        display: 'block', // Ensure event is displayed as a block
        extendedProps: {
          scheduledTime: task.scheduledTime,
        },
      };
    });

  return (
    <CalendarPageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Calendar</Title>
      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true} // Allows events to be dragged and resized
          selectable={true} // Allows date/time selection
          eventContent={renderEventContent} // Custom event content rendering
        />
      </CalendarWrapper>
    </CalendarPageContainer>
  );
};

export default CalendarPage;