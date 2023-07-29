import { Component } from "react";
import Layout from "../../LayoutArea/Layout/Layout";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GetTeamShifts, GetTeamTemplate, GetTeamList, CreateTeamShifts, GetRoles, updateTemplate, deleteTemplate, CreateTemplate } from "../../../actions/apiActions";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { ChromePicker } from 'react-color';
import "./Prioritizer.css";
import Select from 'react-select';
import DatePicker from "react-datepicker";

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
        isPopupOpen: false,
        selectedTemplate: null,
        showTemplateModal: false,
        eventId: 0,
        shiftTemplate: [],
        selectedDay: new Date(),
        draggedEvent: {},
        ShiftID: null,
        roles: [],
    };



    async componentDidMount() {
        // const shiftTemplate = [{ title: "morning", eventStartHour: "12:00", eventEndHour: "18:00", id: 0, amount: 5, color: "#DCC224" }];
        // this.setState({ shiftTemplate });
        const { selectedDay } = this.state;
        const teams = await GetTeamList();
        const roles = await GetRoles();
        this.setState({ roles: roles });
        this.setState({ teams: teams });
        if (0 < teams.length) {
            let options = { value: teams[0].id, label: teams[0].name }
            this.setState({ selectedTitles: options });
            const template = await GetTeamTemplate(teams[0].id);
            this.setState({ shiftTemplate: template });
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
                    for (let j = 0; j < PossibleShifts.length; j++) {
                        const newEvent = {
                            title: PossibleShifts[j].ShiftName,
                            start: this.parseDateTime(date, PossibleShifts[j].StartHour),
                            end: this.parseDateTime(date, PossibleShifts[j].EndHour),
                            Color: PossibleShifts[j].Color,
                            isDraggable: true,
                            isResizable: true,
                            id: this.state.eventId++,
                            rolesAmount: []
                        };
                        for (let k = 0; k < PossibleShifts[j].NeededRoles.length; k++) {
                            newEvent.rolesAmount.push({
                                "roleId": PossibleShifts[j].NeededRoles[k].RoleID,
                                "amount": PossibleShifts[j].NeededRoles[k].NeededWorkers
                            })
                        }
                        events.push(newEvent);
                    }
                }
                this.setState({ events: events });
                this.setState({ shiftId: shiftId });
            }
        }
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
        } else if (hourString.length === 1) {
            hourValue = '00'
            minuteValue = '00';
        } else {
            hourValue = hourString.substring(0, 2);
            minuteValue = hourString.substring(2, 4);
        }

        // Create a new Date object using the extracted values
        const formattedDate = new Date(`${year}-${month}-${day}T${hourValue}:${minuteValue}`);

        return formattedDate;
    }

    parseHour = (hour) => {
        const hourString = hour.toString();
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
        return { hourValue: hourValue, minuteValue: minuteValue };
    }

    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.Color,
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
        const { StartHour, EndHour, TemplateName, NeededRoles, Color } = this.state.draggedEvent;
        const startDate = this.parseHour(StartHour)
        const endDate = this.parseHour(EndHour)
        const startHour = startDate.hourValue
        const startMinute = startDate.minuteValue
        const endHour = endDate.hourValue
        const endMinute = endDate.minuteValue

        const newStart = moment(start)
            .hour(parseInt(startHour))
            .minute(parseInt(startMinute))
            .toDate();

        const newEnd = moment(end)
            .hour(parseInt(endHour))
            .minute(parseInt(endMinute))
            .toDate();

        const newEvent = {
            title: TemplateName,
            start: newStart,
            end: newEnd,
            Color: Color,
            allDay,
            ...rest,
            isDraggable: true,
            isResizable: true,
            id: this.state.eventId++,
            rolesAmount: []
        };
        for (let k = 0; k < NeededRoles.length; k++) {
            newEvent.rolesAmount.push({
                "roleId": NeededRoles[k].RoleID,
                "amount": NeededRoles[k].NeededWorkers
            })
        }

        this.setState({ events: [...this.state.events, newEvent] });
    };

    onSelectSlot = ({ start, end }) => {
        const newEvent = {
            start,
            end,
            title: "New Shift",
            Color: "#2ecc71",
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

    handleTitleTemplateChange = e => {
        const { selectedTemplate } = this.state;
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                TemplateName: e.target.value
            }
        });
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

    handleColorTemplateChange = color => {
        const { selectedTemplate } = this.state;
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                Color: color.hex
            }
        });
    }
    handleColorChange = color => {
        const { selectedEvent } = this.state;
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                Color: color.hex
            }
        });
    };

    handleDateChange = (date) => {
        const selectedDate = this.state.selectedDay;
        const isDifferentWeek = isDifferentWeeks(date, selectedDate);
        this.setState({ selectedDay: date });
        if (isDifferentWeek) {
            this.getShifts(this.state.selectedTitles, date);
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
        this.getTemplate(selectedOption.value)
        this.getShifts(selectedOption, this.state.selectedDay);
    }

    async getTemplate(teamId) {
        const templates = await GetTeamTemplate(teamId)
        this.setState({ shiftTemplate: templates })
    }

    async getShifts(selectedOption, selectedDay) {
        this.setState({ events: [] });
        this.setState({ shiftId: null });
        const userEvents = await GetTeamShifts(selectedOption.value, {
            "RangedDates": {
                "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay))
            }
        });
        if (userEvents.length > 0) {
            const shiftId = userEvents[0].ShiftID;
            const events = [];
            let DailyShifts = userEvents[0].DailyShifts;
            for (let i = 0; i < DailyShifts.length; i++) {
                let date = DailyShifts[i].Date
                let PossibleShifts = DailyShifts[i].PossibleShifts
                for (let j = 0; j < PossibleShifts.length; j++) {
                    const newEvent = {
                        title: PossibleShifts[j].ShiftName,
                        start: this.parseDateTime(date, PossibleShifts[j].StartHour),
                        end: this.parseDateTime(date, PossibleShifts[j].EndHour),
                        Color: PossibleShifts[j].Color,
                        isDraggable: true,
                        isResizable: true,
                        id: this.state.eventId++,
                        rolesAmount: []
                    };
                    for (let k = 0; k < PossibleShifts[j].NeededRoles.length; k++) {
                        newEvent.rolesAmount.push({
                            "roleId": PossibleShifts[j].NeededRoles[k].RoleID,
                            "amount": PossibleShifts[j].NeededRoles[k].NeededWorkers
                        })
                    }
                    events.push(newEvent);
                }
            }
            this.setState({ events: events });
            this.setState({ shiftId: shiftId });
        }
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
                "Color": sortedEvents[i].Color,
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
        const response = await CreateTeamShifts(id, data);
        if (Object.keys(response).length != 0) {
            this.setState({ ShiftID: response.ShiftID })
        }
    }

    async createNewTemplate(template) {
        const response = await CreateTemplate(template);
        if (Object.keys(response).length != 0) {
            const { shiftTemplate } = this.state;
            shiftTemplate.push(response);
            this.setState({ shiftTemplate: shiftTemplate })
        }
    }

    handleSaveTemplateChanges = () => {
        const { selectedTemplate, shiftTemplate } = this.state;
        if (!selectedTemplate.TemplateID) {
            this.createNewTemplate(selectedTemplate);
            this.setState({
                isPopupOpen: false,
                selectedTemplate: null,
            });
            return
        }
        this.saveTemplate(selectedTemplate);
        const selectedIndex = shiftTemplate.findIndex(template => template.TemplateID === selectedTemplate.TemplateID);
        if (selectedIndex !== -1) {
            // Replace the selectedTemplate in the shiftTemplate list
            const updatedShiftTemplate = [...shiftTemplate];
            updatedShiftTemplate[selectedIndex] = selectedTemplate;
            this.setState({
                shiftTemplate: updatedShiftTemplate,
                isPopupOpen: false,
                selectedTemplate: null,
            });
        }
        else {
            this.setState({
                isPopupOpen: false,
                selectedTemplate: null,
            });
        }
    }

    async saveTemplate(template) {
        const { selectedTitles } = this.state;
        let response = await updateTemplate(template);
        if (Object.keys(response).length === 0) {
            const templates = await GetTeamTemplate(selectedTitles.value)
            this.setState({ shiftTemplate: templates })
        }
    }

    handleAddTemplateRole = () => {
        const { selectedTemplate } = this.state;
        const newRole = {
            roleId: "", // Will store the role's ID
            NeededWorkers: 0 // Will store the corresponding amount
        };
        const updatedRolesAmount = [...selectedTemplate.NeededRoles, newRole];
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                NeededRoles: updatedRolesAmount
            }
        });
    }
    handleAddRole = () => {
        const { selectedEvent } = this.state;
        const newRole = {
            roleId: "", // Will store the role's ID
            amount: 0 // Will store the corresponding amount
        };
        const updatedRolesAmount = [...selectedEvent.rolesAmount, newRole];
        this.setState({
            selectedEvent: {
                ...selectedEvent,
                rolesAmount: updatedRolesAmount
            }
        });
    };
    handleRoleTemplateChange = (event, index) => {
        const { selectedTemplate } = this.state;
        const updatedRolesAmount = [...selectedTemplate.NeededRoles];
        updatedRolesAmount[index].RoleID = event.target.value;
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                NeededRoles: updatedRolesAmount
            }
        });
    }
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

    handleAmountTemplateChange = (event, index) => {
        const { selectedTemplate } = this.state;
        const updatedRolesAmount = [...selectedTemplate.NeededRoles];
        updatedRolesAmount[index].NeededWorkers = parseInt(event.target.value);
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                NeededRoles: updatedRolesAmount
            }
        });
    }
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

    handleRemoveTemplateRole = (index) => {
        const { selectedTemplate } = this.state;
        const updatedRolesAmount = [...selectedTemplate.NeededRoles];
        updatedRolesAmount.splice(index, 1);
        this.setState({
            selectedTemplate: {
                ...selectedTemplate,
                NeededRoles: updatedRolesAmount
            }
        });
    }
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

    handleClick = (template) => {
        let temp = { ...template }
        this.setState({
            isPopupOpen: true,
            selectedTemplate: temp,
        });
    };

    async deleteTemplate(templateId) {
        const { selectedTitles } = this.state;
        let response = await deleteTemplate(templateId);
        if (!response) {
            const templates = await GetTeamTemplate(selectedTitles.value)
            this.setState({ shiftTemplate: templates })
        }
    }

    handleDeletePopup = () => {
        const { selectedTemplate, shiftTemplate } = this.state;
        if (!selectedTemplate.TemplateID) {
            this.setState({
                isPopupOpen: false,
                selectedTemplate: null,
            });
            return
        }
        this.deleteTemplate(selectedTemplate.TemplateID);
        const selectedIndex = shiftTemplate.findIndex(template => template.TemplateID === selectedTemplate.TemplateID);
        if (selectedIndex !== -1) {
            const updatedShiftTemplate = [...shiftTemplate];

            // Remove the element at the selectedIndex
            updatedShiftTemplate.splice(selectedIndex, 1);
            this.setState({
                shiftTemplate: updatedShiftTemplate,
                isPopupOpen: false,
                selectedTemplate: null,
            });
        }
        else {
            this.setState({
                isPopupOpen: false,
                selectedTemplate: null,
            });
        }
    };
    handleClosePopup = () => {
        this.setState({
            isPopupOpen: false,
            selectedTemplate: null,
        });
    };

    handleTemplateNameChange = (event) => {
        this.setState({ selectedTemplate: event });
    };

    getRoleNameFromId(roleId) {
        const roles = this.state.roles
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].id === roleId) {
                return roles[i].name;
            }
        }
        return roles[0].name
    }

    createTemplate() {
        const { selectedTitles } = this.state;
        const newTemplate = {
            "TemplateID": null,
            "TeamID": selectedTitles.value,
            "TemplateName": "",
            "StartHour": 0,
            "EndHour": 0,
            "Color": "#ffffff",
            "NeededRoles": [
            ]
        }
        this.setState({
            isPopupOpen: true,
            selectedTemplate: newTemplate,
        });
    }

    integerToHour(integer) {
        const hourPart = Math.floor(integer / 100);
        const minutePart = integer % 100;
        return `${hourPart.toString().padStart(2, "0")}:${minutePart.toString().padStart(2, "0")}`;
    }

    hourToInteger(hour) {
        const [hourPart, minutePart] = hour.split(":");
        return parseInt(hourPart, 10) * 100 + parseInt(minutePart, 10);
    }

    handleStartHourChange = (e) => {
        const value = e.target.value;
        this.setState((prevState) => ({
            selectedTemplate: {
                ...prevState.selectedTemplate,
                StartHour: this.hourToInteger(value),
            },
        }));
    };

    handleEndHourChange = (e) => {
        const value = e.target.value;
        this.setState((prevState) => ({
            selectedTemplate: {
                ...prevState.selectedTemplate,
                EndHour: this.hourToInteger(value),
            },
        }));
    };



    render() {
        const { events, teams, selectedTitles, selectedEvent, showModal, shiftTemplate, selectedDay, roles, showPopup } = this.state;
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

                        {showModal && (
                            <div className="popup-overlay">
                                <div className="popup">
                                    <h3>Edit shift</h3>
                                    <div>
                                        <input value={selectedEvent.title} onChange={this.handleTitleChange} />
                                    </div>
                                    <div>
                                        <ChromePicker
                                            color={selectedEvent.Color}
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
                                    <div>
                                        <div>
                                            <button onClick={this.handleSaveChanges}>Save changes</button>
                                            <button onClick={() => this.setState({ showModal: false })}>Close</button>
                                            <button onClick={this.handleDeleteEvent}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="template-wrapper" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h2>Templates</h2>
                            <div style={{ flex: '90%', overflowY: 'auto' }}>
                                {shiftTemplate.map(template => (
                                    <div
                                        className="template-item"
                                        draggable="true"
                                        key={template.TemplateName}
                                        id={template.TemplateID}
                                        title={template.TemplateName}
                                        onDragStart={() => this.handleDragStart(template)}
                                        onClick={() => this.handleClick(template)}
                                        style={{ backgroundColor: template.Color }}
                                    >
                                        {template.TemplateName}
                                    </div>
                                ))}
                            </div>
                            <div style={{ flex: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <button onClick={() => this.createTemplate()}>
                                    Create Template
                                </button>
                            </div>
                        </div>
                        {this.state.isPopupOpen && (
                            <div className="popup-overlay">
                                <div className="popup">
                                    <h3>Edit Template</h3>
                                    <div>
                                        <label>
                                            Template Name:
                                            <input
                                                type="text"
                                                value={this.state.selectedTemplate.TemplateName}
                                                onChange={this.handleTitleTemplateChange}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Start Hour:
                                            <input
                                                type="time"
                                                value={this.integerToHour(this.state.selectedTemplate.StartHour)}
                                                onChange={this.handleStartHourChange}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            End Hour:
                                            <input
                                                type="time"
                                                value={this.integerToHour(this.state.selectedTemplate.EndHour)}
                                                onChange={this.handleEndHourChange}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <ChromePicker
                                            color={this.state.selectedTemplate.Color}
                                            onChange={this.handleColorTemplateChange}
                                        />
                                    </div>
                                    <div>
                                        {this.state.selectedTemplate.NeededRoles.map((roleAmount, index) => (
                                            <div key={index} style={{ marginBottom: "10px" }}>
                                                <select
                                                    value={roleAmount.RoleID}
                                                    onChange={(e) => this.handleRoleTemplateChange(e, index)}
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
                                                    value={roleAmount.NeededWorkers}
                                                    onChange={(e) => this.handleAmountTemplateChange(e, index)}
                                                />
                                                <button onClick={() => this.handleRemoveTemplateRole(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={this.handleAddTemplateRole}>Add Role</button>
                                    {/* Add more form inputs for other fields as needed */}
                                    <div>
                                        <button onClick={this.handleSaveTemplateChanges}>Save Changes</button>
                                        <button onClick={this.handleClosePopup}>Close</button>
                                        <button onClick={this.handleDeletePopup}>Delete template</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button className="thebutton" onClick={this.handleCreateShifts}>Save Changes</button>
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