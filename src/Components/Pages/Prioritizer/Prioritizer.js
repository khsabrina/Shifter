import { Component } from "react";
import Layout from "../../LayoutArea/Layout/Layout";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GetTeamShifts, GetTeamTemplate, GetTeamList, CreateTeamShifts, GetRoles } from "../../../actions/apiActions";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Modal from 'react-modal';
import { ChromePicker } from 'react-color';
import "./Prioritizer.css";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { format } from 'date-fns'

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function get_day_format(selectedDay) {
    const year = selectedDay.getFullYear();
    const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDay.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function get_hour_format(selectedDay) {
    const hour = String(selectedDay.getHours());
    const minute = String(selectedDay.getMinutes()).padStart(2, '0');
    return `${hour}${minute}`;
}

function getSunday(selectedDay) {
    const sunday = new Date(selectedDay);
    sunday.setDate(selectedDay.getDate() - selectedDay.getDay());
    return sunday;
}

// Function to get the Saturday date of the selectedDay
function getSaturday(selectedDay) {
    const saturday = new Date(selectedDay);
    saturday.setDate(selectedDay.getDate() + (6 - selectedDay.getDay()));
    return saturday;
}
class Prioritizer extends Component {
    state = {
        events: [],
        teams: [],
        selectedEvent: null,
        selectedTitles: {},
        showModal: false,
        selectedTemplate: null,
        showTemplateModal: false,
        eventId: 0,
        shiftTemplate: [],
        selectedDay: new Date(),
        draggedEvent: {},
        ShiftID: null,
        roles: []
    };



    async componentDidMount() {
        // const shiftTemplate = [{ title: "morning", eventStartHour: "12:00", eventEndHour: "18:00", id: 0, amount: 5, color: "#DCC224" }];
        // this.setState({ shiftTemplate });
        const { selectedDay } = this.state;
        const teams = await GetTeamList();
        const roles = await GetRoles();
        this.setState({ roles: roles });
        if (0 < teams.length) {
            let options = { value: teams[0].id, label: teams[0].name }
            this.setState({ selectedTitles: options });
            const userEvents = await GetTeamShifts(teams[0].id, {
                "RangedDates":
                    { "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay)) }
            });
            if (userEvents.length > 0) {
                const shiftId = userEvents[0].ShiftID;
                const events = [];
                let DailyShifts = userEvents[0].DailyShifts;
                for (let i = 0; i < DailyShifts.length; i++) {
                    let date = DailyShifts[i].Date
                    let PossibleShifts = DailyShifts[i].PossibleShifts
                    console.log(PossibleShifts)
                    for (let j = 0; j < PossibleShifts.length; j++) {
                        const newEvent = {
                            title: PossibleShifts[j].ShiftName,
                            start: this.parseDateTime(date, PossibleShifts[j].StartHour),
                            end: this.parseDateTime(date, PossibleShifts[j].EndHour),
                            // color: color,
                            isDraggable: true,
                            isResizable: true,
                            id: this.state.eventId++
                        };
                        events.push(newEvent);
                    }
                }
                this.setState({ events: events });
                this.setState({ shiftId: shiftId });
            }
        }
        this.setState({ teams: teams });
    }

    parseDateTime = (date, hour) => {
        // Convert date and hour to string
        const dateString = date.toString();
        const hourString = hour.toString();

        // Extract year, month, and day from the date string
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);

        // Extract hour and minute from the hour string
        let hourValue;
        let minuteValue;

        if (hourString.length === 3) {
            hourValue = '0' + hourString.substring(0, 1);
            minuteValue = hourString.substring(1, 3);
        } else {
            hourValue = hourString.substring(0, 2);
            minuteValue = hourString.substring(2, 4);
        }

        // Create a new Date object using the extracted values
        const formattedDate = new Date(`${year}-${month}-${day}T${hourValue}:${minuteValue}`);

        return formattedDate;
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
        const { eventStartHour, eventEndHour, title, color } = this.state.draggedEvent;
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
            color: color,
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
            // amount: 0,
            rolesAmount: [],
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

    handleDateChange = (date) => {
        const selectedDate = this.state.selectedDay;
        this.setState({ selectedDay: date });
        const isDifferentWeek = isDifferentWeeks(date, selectedDate);
        if (isDifferentWeek) {
            this.getShifts(this.state.selectedTitles);
        }
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

    handleChange = (selectedOption) => {
        this.setState({ selectedTitles: selectedOption });
        const userEvents = this.getShifts(selectedOption);

    }

    async getShifts(selectedOption) {
        const { selectedDay } = this.state;
        const userEvents = await GetTeamShifts(selectedOption.value, {
            "RangedDates": {
                "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay))
            }
        });
    }

    handleCreateShifts = () => {
        const { selectedDay } = this.state;
        const { events } = this.state;
        const sortedEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
        const data = {
            "CompanyID": localStorage.getItem("companyId"),
            "TeamID": this.state.selectedTitles.value,
            "StartDate": get_day_format(getSunday(selectedDay)),
            "EndDate": get_day_format(getSaturday(selectedDay)),
            "ShiftID": null
        };
        const DailyShifts = [];
        let inside_data = { "Date": null };
        for (let i = 0; i < sortedEvents.length; i++) {
            if (inside_data["Date"] != get_day_format(sortedEvents[i].start)) {
                if (inside_data["Date"] != null) {
                    DailyShifts.push(inside_data);
                }
                inside_data = {
                    "Date": get_day_format(sortedEvents[i].start),
                    "StartHour": "0000",
                    "EndHour": "2359",
                    "PossibleShifts": []
                }
            }
            const PossibleShift = {
                "ShiftName": sortedEvents[i].title,
                "StartHour": get_hour_format(sortedEvents[i].start),
                "EndHour": get_hour_format(sortedEvents[i].end),
                "NeededRoles": []
            }
            for (let j = 0; j < sortedEvents[i].rolesAmount.length; j++) {
                PossibleShift["NeededRoles"].push({
                    "RoleID": sortedEvents[i].rolesAmount[j].roleId,
                    "NeededWorkers": sortedEvents[i].rolesAmount[j].amount
                })
            }
            inside_data["PossibleShifts"].push(PossibleShift)
        }
        if (inside_data["Date"] != null) {
            DailyShifts.push(inside_data);
        }
        if (DailyShifts.length > 0) {
            data["DailyShifts"] = DailyShifts;
            this.createShifts(this.state.selectedTitles.value, data)
        }
    }

    async createShifts(id, data) {
        const { ShiftID } = this.state;
        if (ShiftID) {

        }
        else {
            const response = await CreateTeamShifts(id, data);
            this.setState({ ShiftID: response.ShiftID })
        }
    }

    handleAddRole = () => {
        const { selectedEvent } = this.state;
        const newRole = {
            roleId: "", // Will store the role's ID
            amount: "" // Will store the corresponding amount
        };
        const updatedRolesAmount = [...selectedEvent.rolesAmount, newRole];
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                rolesAmount: updatedRolesAmount
            }
        });
    };
    handleRoleChange = (event, index) => {
        const { selectedEvent } = this.state;
        const updatedRolesAmount = [...selectedEvent.rolesAmount];
        updatedRolesAmount[index].roleId = event.target.value;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                rolesAmount: updatedRolesAmount
            }
        });
    };

    handleAmountChange = (event, index) => {
        const { selectedEvent } = this.state;
        const updatedRolesAmount = [...selectedEvent.rolesAmount];
        updatedRolesAmount[index].amount = event.target.value;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                rolesAmount: updatedRolesAmount
            }
        });
    };

    handleRemoveRole = (index) => {
        const { selectedEvent } = this.state;
        const updatedRolesAmount = [...selectedEvent.rolesAmount];
        updatedRolesAmount.splice(index, 1);
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                rolesAmount: updatedRolesAmount
            }
        });
    };



    render() {
        const { events, teams, selectedTitles, selectedEvent, showModal, shiftTemplate, selectedDay, roles } = this.state;
        const options = teams.map(team => ({
            value: team.id,
            label: team.name
        }));
        const DADCalendarFormats = {
            timeGutterFormat: (date, culture, localizer) =>
                localizer.format(date, "HH:mm", culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                localizer.format(start, "HH:mm", culture) + " - " +
                localizer.format(end, "HH:mm", culture)
        }
        return (
            <div className="dndwrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="tool-bar">
                    <div className="date-picker-wrapper">
                        <DatePicker
                            portalId="root-portal"
                            selected={selectedDay}
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
                            options={options}
                            onChange={this.handleChange}
                            className="select-menu"
                            classNamePrefix="select"
                            value={selectedTitles}
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
                            date={selectedDay}
                            onNavigate={date => { this.handleDateChange(date); }}
                        />
                        <Modal
                            appElement={document.getElementById('root')}
                            className="modal"
                            isOpen={showModal}
                            onRequestClose={() => this.setState({ showModal: false })}
                            style={{
                                content: {
                                    height: "fit-content",
                                    width: "fit-content",
                                    position: "fixed",
                                    inset: "unset",
                                    top: "50%",
                                    left: "50%"
                                }
                            }}
                        >
                            {selectedEvent && (
                                <div>
                                    <div style={{ marginBottom: "10px" }}>
                                        <input value={selectedEvent.title} onChange={this.handleTitleChange} />
                                    </div>
                                    <div className="color-picker-container" style={{ marginBottom: "10px" }}>
                                        <ChromePicker
                                            color={selectedEvent.color}
                                            onChange={this.handleColorChange}
                                        />
                                    </div>
                                    <div>
                                        {selectedEvent.rolesAmount.map((roleAmount, index) => (
                                            <div key={index} style={{ marginBottom: "10px" }}>
                                                <select
                                                    value={roleAmount.roleId}
                                                    onChange={(e) => this.handleRoleChange(e, index)}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    value={roleAmount.amount}
                                                    onChange={(e) => this.handleAmountChange(e, index)}
                                                />
                                                <button onClick={() => this.handleRemoveRole(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={this.handleAddRole}>Add Role</button>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <button onClick={this.handleDeleteEvent}>Delete</button>
                                        <button onClick={this.handleSaveChanges}>Save changes</button>
                                    </div>
                                </div>
                            )}
                        </Modal>

                    </div>
                    <div className="template-wrapper" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h2>Templates</h2>
                            <div style={{ flex: '90%', overflowY: 'auto' }}>
                                {shiftTemplate.map(template => (
                                    <div
                                        className="template-item"
                                        draggable="true"
                                        key={template.title}
                                        id={template.id}
                                        title={template.title}
                                        onDragStart={() => this.handleDragStart(template)}
                                        style={{ backgroundColor: template.color }}
                                    >
                                        {template.title}
                                    </div>
                                ))}
                            </div>
                            <div style={{ flex: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <button>Create Template</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={this.handleCreateShifts}>Save Changes</button>
            </div>
        );
    }
}

function isDifferentWeeks(date1, date2) {
    const weekStart1 = getWeekStartDate(date1);
    const weekStart2 = getWeekStartDate(date2);
    return weekStart1.getTime() !== weekStart2.getTime();
}

// Function to get the start date (Sunday) of the week for a given date
function getWeekStartDate(date) {
    const startDay = 0; // 0 for Sunday, 1 for Monday, etc.
    const startDate = new Date(date);
    const diff = startDate.getDate() - startDate.getDay() + (startDate.getDay() === startDay ? 0 : 7);
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
}

function MainPrioritizer() {
    // TODO: if the user is not admin - new screen
    return <Layout PageName="Prioritizer" component={Prioritizer} />;
}

export default MainPrioritizer;