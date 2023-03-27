import { FC, useState } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'
// import Popup from "../EventPopup/EventPopup";
import Modal from 'react-modal';


// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
//import { fireEvent } from '@testing-library/react'


const Calendar1: FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Learn cool stuff',
      start,
      end,
    },
  ])
  const [currEvent, setcurrEvent] = useState<Event>(events[0]);
  
  const onEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { start, end, event } = data;
    setEvents(currentEvents => {
      const updatedEvent = {
        ...event, // Keep all properties of the original event
        start: new Date(start),
        end: new Date(end),
      };
      const eventIdx = currentEvents.findIndex(evt => evt === event); // Find the index of the original event in the currentEvents array
      const updatedEvents = [...currentEvents]; // Make a copy of the current events array
      updatedEvents[eventIdx] = updatedEvent; // Replace the original event with the updated event
      return updatedEvents;
    });
  }

  const onEventDrop: withDragAndDropProps['onEventDrop'] = data => {
    const { start, end, event } = data;
    setEvents(currentEvents => {
      const updatedEvent = {
        ...event, // Keep all properties of the original event
        start: new Date(start),
        end: new Date(end),
      };
      const eventIdx = currentEvents.findIndex(evt => evt === event); // Find the index of the original event in the currentEvents array
      const updatedEvents = [...currentEvents]; // Make a copy of the current events array
      updatedEvents[eventIdx] = updatedEvent; // Replace the original event with the updated event
      return updatedEvents;
    });
  }

  const handleEventClick = (clickedEvent: Event) => {
    setShowPopup(true);
    setcurrEvent(clickedEvent)
    console.log(clickedEvent.end)
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);

  };

  return (
    <div>
    <DnDCalendar
      defaultView='week'
      events={events}
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      style={{ height: '90vh' }}
      onSelectEvent={(event: Event) => {handleEventClick(event)}}
    />

    {/* <Modal isOpen={showPopup} onRequestClose={handleClosePopup}>
      <Popup event={currEvent}  onClose={handleClosePopup}/>
    </Modal> */}
    </div>
  )
}

const locales = {
  'en-US': enUS,
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

export default Calendar1