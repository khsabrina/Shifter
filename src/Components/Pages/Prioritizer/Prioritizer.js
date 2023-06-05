import { Component } from "react";
import Layout from "../../LayoutArea/Layout/Layout";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GetTeamShifts } from "../../../actions/apiActions";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Modal from 'react-modal';
import { ChromePicker } from 'react-color';
import "./Prioritizer.css";
import Select from 'react-select';
import DatePicker from "react-datepicker";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

class Prioritizer extends Component {
    state = {
        events: [],
        selectedEvent: null,
        showModal: false,
        eventId: 0,
        shiftTemplate: [],
        draggedEvent: {}
    };

    async componentDidMount() {
        const shiftTemplate = [{ title: "morning", eventStartHour: "12:00", eventEndHour: "18:00", Id: 0, amount: 5 }];
        this.setState({ shiftTemplate });

        const userEvents = await GetTeamShifts(0);
        const events = userEvents.shifts.flatMap(shift => {
            const { color, title, start, end } = shift;
            return start.map((startDate, index) => ({
                start: moment(startDate).toDate(),
                end: moment(end[index]).toDate(),
                title,
                color,
                isDraggable: true,
                isResizable: true,
                id: this.state.eventId++
            }));
        });
        this.setState({ events });
        // const userTemplates = await GetTemplates(0);
    }

    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.color,
                className: 'isDraggable isResizable'
            }
        };
    };

    handleSelectEvent = (event) => {
        this.setState({ selectedEvent: event, showModal: true });
    }

    onEventDrop = ({ event, start, end }) => {
        const { events } = this.state;
        const index = events.indexOf(event);
        const updatedEvent = { ...event, start, end };
        const updatedEvents = [...events];
        updatedEvents.splice(index, 1, updatedEvent);
        this.setState({ events: updatedEvents });
    };

    onDropFromOutside = ({ start, end, allDay, ...rest }) => {
        const { eventStartHour, eventEndHour, title } = this.state.draggedEvent;
        const startHour = eventStartHour.split(':')[0];
        const startMinute = eventStartHour.split(':')[1];
        const endHour = eventEndHour.split(':')[0];
        const endMinute = eventEndHour.split(':')[1];

        const newStart = moment(start)
            .hour(parseInt(startHour))
            .minute(parseInt(startMinute))
            .toDate();

        const newEnd = moment(end)
            .hour(parseInt(endHour))
            .minute(parseInt(endMinute))
            .toDate();

        const newEvent = {
            title: title,
            start: newStart,
            end: newEnd,
            amount: 0,
            allDay,
            ...rest,
            isDraggable: true,
            isResizable: true,
            id: this.state.eventId++
        };

        this.setState({ events: [...this.state.events, newEvent] });
    };

    onSelectSlot = ({ start, end }) => {
        const newEvent = {
            start,
            end,
            title: "New Event",
            color: "#2ecc71",
            isDraggable: true,
            isResizable: true,
            amount: 0,
            id: this.state.eventId++
        };
        this.setState({
            events: [...this.state.events, newEvent],
            selectedEvent: newEvent,
            showModal: true
        });
    };

    onEventResize = ({ event, start, end, allDay }) => {
        const { events } = this.state;
        const index = events.indexOf(event);
        const updatedEvent = { ...event, start, end, allDay };
        const updatedEvents = [...events];
        updatedEvents.splice(index, 1, updatedEvent);
        this.setState({ events: updatedEvents });
    };

    handleTitleChange = e => {
        const { selectedEvent } = this.state;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                title: e.target.value
            }
        });
    };

    handleColorChange = color => {
        const { selectedEvent } = this.state;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                color: color.hex
            }
        });
    };

    handleAmountChange = event => {
        const { selectedEvent } = this.state;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                amount: event.target.value,
            }
        });
    }

    handleDeleteEvent = () => {
        const { selectedEvent, events } = this.state;
        const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        this.setState({
            events: updatedEvents,
            selectedEvent: null,
            showModal: false
        });
    };

    handleSaveChanges = () => {
        const { selectedEvent, events } = this.state;
        const updatedEvents = events.map(event => {
            if (event.id === selectedEvent.id) {
                return selectedEvent;
            }
            return event;
        });
        this.setState({
            events: updatedEvents,
            selectedEvent: null,
            showModal: false
        })
    }

    handleDragStart = (dragEvent) => {
        this.setState({ draggedEvent: dragEvent })
    }


    render() {
        const { events, selectedEvent, showModal, shiftTemplate } = this.state;
        const DADCalendarFormats = {
            timeGutterFormat: (date, culture, localizer) =>
                localizer.format(date, "HH:mm", culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                localizer.format(start, "HH:mm", culture) + " - " +
                localizer.format(end, "HH:mm", culture)
        }
        const colorStyles = {
            option: (styles, { data }) => { return { ...styles, color: data.color } },
            multiValue: (styles, { data }) => { return { ...styles, backgroundColor: data.color, color: "#fff" } },
            multiValueRemove: (styles, { data }) => { return { ...styles, color: "#fff", cursor: 'pointer' } },
            multiValueLabel: (styles, { data }) => { return { ...styles, color: "#fff" } },
        }
        return (
            <div className="dndwrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tool-bar">
                    <div className="date-picker-wrapper">
                        <DatePicker
                            portalId="root-portal"
                            // selected={selectedDay}
                            onChange={this.handleDateChange}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="date-picker"
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Choose a date"
                        />
                    </div>
                    <div className="select-menu-wrapper" >
                        <label htmlFor="select-menu" className="label-left">Select team:</label>
                        <Select
                            // options={groupedOptions}
                            isMulti
                            onChange={this.handleChange}
                            className="select-menu"
                            classNamePrefix="select"
                            styles={colorStyles}
                        // value={defaultSelectedOptions}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className="dndcalendar">
                        <DragAndDropCalendar
                            localizer={localizer}
                            dayLayoutAlgorithm="no-overlap"
                            formats={DADCalendarFormats}
                            defaultView="week"
                            views={["day", "week"]}
                            events={events}
                            draggableAccessor="isDraggable"
                            resizableAccessor="isResizable"
                            onDropFromOutside={this.onDropFromOutside}
                            eventPropGetter={this.eventStyleGetter}
                            onEventDrop={this.onEventDrop}
                            onEventResize={this.onEventResize}
                            onSelectSlot={this.onSelectSlot}
                            onSelectEvent={this.handleSelectEvent}
                            resizable
                            selectable
                        />
                        <Modal
                            className='modal'
                            isOpen={showModal}
                            onRequestClose={() => this.setState({ showModal: false })}
                            style={{
                                content: {
                                    height: 'fit-content',
                                    width: 'fit-content',
                                    position: 'fixed',
                                    inset: 'unset',
                                    top: '50%',
                                    left: '50%',
                                },
                            }}
                        >
                            {selectedEvent && (
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <input value={selectedEvent.title} onChange={this.handleTitleChange} />
                                    </div>
                                    <div className="color-picker-container" style={{ marginBottom: '10px' }}>
                                        <ChromePicker color={selectedEvent.color} onChange={this.handleColorChange} />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <input
                                            type="number" // Change the input type to "number"
                                            value={selectedEvent.amount.toString()} // Convert amount to string
                                            onChange={this.handleAmountChange}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={this.handleDeleteEvent}>Delete</button>
                                        <button onClick={this.handleSaveChanges}>Save changes</button>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </div>
                    <div className="template-wrapper" style={{ flex: 1 }}>
                        <h2>Templates</h2>
                        {shiftTemplate.map(template => (
                            <div
                                className="template-item"
                                draggable="true"
                                key={template.title}
                                id={template.id}
                                onDragStart={() =>
                                    this.handleDragStart(template)
                                }
                            >
                                {template.title}
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={this.handleSaveChanges}>Save Changes</button>
            </div>
        );
    }
}

function MainPrioritizer() {
    return <Layout PageName="Prioritizer" component={Prioritizer} />;
}

export default MainPrioritizer;