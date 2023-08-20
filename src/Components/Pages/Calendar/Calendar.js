import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../LayoutArea/Layout/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { GetTeamAssignments, TeamInfo, GetTeamList, updateAssignments } from "../../../actions/apiActions";
import Select from 'react-select';
import swal from 'sweetalert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

function isDifferentWeeks(date1, date2) {
    const weekStart1 = getWeekStartDate(date1);
    const weekStart2 = getWeekStartDate(date2);
    return weekStart1.getTime() !== weekStart2.getTime();
}

function getWeekStartDate(date) {
    const startDay = 0; // 0 for Sunday, 1 for Monday, etc.
    const startDate = new Date(date);
    const diff = startDate.getDate() - startDate.getDay() + (startDate.getDay() === startDay ? 0 : 7);
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
}

const localizer = momentLocalizer(moment);
class MyCalendar extends Component {
    state = {
        events: [],
        selectedDay: new Date(),
        employees: [],
        userColors: {},
        eventId: 0,
        selectedOptions: [],
        selectOptions: [],
        isAdmin: localStorage.getItem("isAdmin"),
        showPopUp: false,
        selectedEvent: null,
        teams: [],
        shiftID: null
    };

    handleChange = (selectedOptions) => {
        this.setState({ selectedOptions });
        if (this.state.isAdmin === "true") {
            this.getTeamAssign(selectedOptions)
        }
    };

    async getTeamAssign(selectedOptions) {
        const { selectedDay } = this.state;
        const userEvents = await GetTeamAssignments({
            "RangedDates":
                { "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay)) }
        }, selectedOptions.value);
        if (userEvents.length != 0) {
            const data = this.createEvents(userEvents[0]);
            this.setState({ events: data["events"] })
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

    createEvents = (response) => {
        let shiftID = response["ShiftID"];
        this.setState({ shiftID: shiftID });
        const week = response["Dailies"];
        const events = [];
        const employeesOptions = new Set();
        for (let i = 0; i < week.length; i++) {
            let day = week[i];
            let date = day["Date"];
            let dayShifts = day["Shifts"];
            for (let j = 0; j < dayShifts.length; j++) {
                let shift = dayShifts[j];
                let startHour = shift["StartHour"];
                let EndHour = shift["EndHour"];
                let employee = shift["EmployeeID"];
                let color = this.state.userColors[employee];
                const newEvent = {
                    title: employee,
                    employee: employee,
                    start: this.parseDateTime(date, startHour),
                    end: this.parseDateTime(date, EndHour),
                    Color: color,
                    isDraggable: true,
                    isResizable: true,
                    id: this.state.eventId++
                }
                employeesOptions.add(employee);
                events.push(newEvent);
            }
        }
        const options = Array.from(employeesOptions).map((employee) => ({
            value: employee,
            label: employee,
            color: this.state.userColors[employee]
        }));
        // this.setState({ selectOptions: options })
        // this.setState({ events: events });
        return { options: options, events: events }

    }

    async componentDidMount() {
        const { selectedDay } = this.state;
        let employees = [];
        if (this.state.isAdmin === "true") {
            employees = await TeamInfo(localStorage.getItem("teamIds")?.split(","));
        }
        else {
            employees = await TeamInfo([localStorage.getItem("teamId")]);
        }
        this.setState({ employees: employees });
        let emplyeeColor = {};
        for (let i = 0; i < employees.length; i++) {
            if (employees[i]["color"] == "0x00000000") {
                emplyeeColor[employees[i]["username"]] = "#3d9bb3"
                continue;
            }
            emplyeeColor[employees[i]["username"]] = employees[i]["color"];
        }
        this.setState({ userColors: emplyeeColor });
        if (this.state.isAdmin === "true") {
            const teams = await GetTeamList();
            this.setState({ teams: teams });
            let options = { value: teams[0].id, label: teams[0].name, color: "#9139d4" }
            this.setState({ selectedOptions: options });
            const selectOptions = teams.map(team => ({
                value: team.id,
                label: team.name,
                color: "#9139d4"
            }));
            this.setState({ selectOptions: selectOptions })
            const userEvents = await GetTeamAssignments({
                "RangedDates":
                    { "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay)) }
            }, teams[0].id);
            if (userEvents.length != 0) {
                const data = this.createEvents(userEvents[0]);
                this.setState({ events: data["events"] })
            }
        }
        else {
            const userEvents = await GetTeamAssignments({
                "RangedDates":
                    { "StartDate": get_day_format(getSunday(selectedDay)), "EndDate": get_day_format(getSaturday(selectedDay)) }
            }, localStorage.getItem("teamId"));
            if (userEvents.length !== 0) {
                const data = this.createEvents(userEvents[0]);
                this.setState({ selectOptions: data["options"] })
                this.setState({ events: data["events"] });
            }
        }
    }

    // function to generate styles for each event based on its color property
    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.Color
            }
        };
    };

    handleSelectEvent = (event) => {
        if (this.state.isAdmin === "true") {
            var copy = {};
            Object.assign(copy, event);
            this.setState({ selectedEvent: copy })
            this.setState({ showPopUp: true })
        }
        else {
            swal({
                title: event.title,
                icon: 'info',
                button: 'OK'
            });
        }
    }

    handleDateChange = (date) => {
        const selectedDate = this.state.selectedDay;
        const isDifferentWeek = isDifferentWeeks(date, selectedDate);
        this.setState({ selectedDay: date });
        if (isDifferentWeek) {
            this.getShifts(date);
        }
    }

    async getShifts(date) {
        if (this.state.isAdmin === "true") {
            this.setState({ events: [] })
            const { selectedOptions } = this.state;
            const userEvents = await GetTeamAssignments({
                "RangedDates":
                    { "StartDate": get_day_format(getSunday(date)), "EndDate": get_day_format(getSaturday(date)) }
            }, selectedOptions.value);
            if (userEvents.length != 0) {
                const data = this.createEvents(userEvents[0]);
                this.setState({ events: data["events"] })
            }
        }
        else {
            this.setState({ events: [], selectOptions: [], selectedOptions: [] })
            const userEvents = await GetTeamAssignments({
                "RangedDates":
                    { "StartDate": get_day_format(getSunday(date)), "EndDate": get_day_format(getSaturday(date)) }
            }, localStorage.getItem("teamId"));
            if (userEvents.length !== 0) {
                const data = this.createEvents(userEvents[0]);
                this.setState({ selectOptions: data["options"] })
                this.setState({ events: data["events"] });
            }
        }
    }

    handleUpdateAssignments = () => {
        const { selectedDay } = this.state;
        const { events } = this.state;
        const sortedEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
        let basic_data = {
            "ShiftID": this.state.shiftID,
            "TeamID": this.state.selectedOptions.value,
            "CompanyID": parseInt(localStorage.getItem("companyId")),
            "StartDate": parseInt(get_day_format(getSunday(selectedDay))),
            "EndDate": parseInt(get_day_format(getSaturday(selectedDay)))
        }
        let Dailies = [];
        let inside_data = { "Date": null };
        for (let i = 0; i < sortedEvents.length; i++) {
            let currentEvent = sortedEvents[i]
            if (inside_data["Date"] != parseInt(get_day_format(currentEvent.start))) {
                if (inside_data["Date"] != null) {
                    Dailies.push(inside_data);
                }
                inside_data = {
                    "Date": parseInt(get_day_format(currentEvent.start)),
                    "StartHour": 0,
                    "EndHour": 2359,
                    "Shifts": []
                }
            }
            let currentShift = {
                "StartHour": parseInt(get_hour_format(currentEvent.start)),
                "EndHour": parseInt(get_hour_format(currentEvent.end)),
                "EmployeeID": currentEvent.title
            }
            inside_data["Shifts"].push(currentShift)
        }
        if (inside_data["Date"] != null) {
            Dailies.push(inside_data);
        }
        basic_data["Dailies"] = Dailies;
        updateAssignments(basic_data);
    }


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
            showPopUp: false
        })
    }

    handleSelectChange = (event) => {
        const { selectedEvent } = this.state;
        const selectedValue = event.target.value;
        const selectedColor = event.target.Color;
        selectedEvent.title = selectedValue;
        selectedEvent.Color = selectedColor;
        selectedEvent.employee = selectedValue;
        this.setState({ selectedEvent: selectedEvent })
    };

    handleDeleteEvent = () => {
        const { selectedEvent, events } = this.state;
        const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        this.setState({
            events: updatedEvents,
            selectedEvent: null,
            showPopUp: false
        });
    };

    render() {
        const { events, selectOptions, selectedDay, selectedOptions, isAdmin, showPopUp, selectedEvent, employees } = this.state;
        const colorStyles = {
            option: (styles, { data }) => { return { ...styles, color: data.color } },
            multiValue: (styles, { data }) => { return { ...styles, backgroundColor: data.color, color: "#fff" } },
            multiValueRemove: (styles, { data }) => { return { ...styles, color: "#fff", cursor: 'pointer' } },
            multiValueLabel: (styles, { data }) => { return { ...styles, color: "#fff" } },
        }
        let showEvents = [];
        let filterEmployees = [];
        if (isAdmin === "true") {
            showEvents = events;
            filterEmployees = employees.filter(employee => employee.team_id === selectedOptions.value);
        }
        else {
            showEvents = events.filter(event => selectedOptions.some(option => option.label === event.employee));
        }

        return (
            <div className="calendar">
                <div className="tool-bar">
                    <div className="select-menu-wrapper" >
                        <label htmlFor="select-menu" className="label-left">Select employees:</label>
                        <Select
                            options={selectOptions}
                            isMulti={this.state.isAdmin !== "true"}
                            onChange={this.handleChange}
                            className="select-menu"
                            classNamePrefix="select"
                            styles={colorStyles}
                            value={selectedOptions}
                        />
                    </div>
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
                </div>
                <Calendar
                    localizer={localizer}
                    events={showEvents}
                    className="calendar-container"
                    defaultView="week"
                    views={["day", "week"]}
                    onView={(view) => this.setState({ view })}
                    eventPropGetter={this.eventStyleGetter} // apply custom styles to events
                    formats={{
                        timeGutterFormat: (date, culture, localizer) =>
                            localizer.format(date, "HH:mm", culture),
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                            localizer.format(start, "HH:mm", culture) + " - " +
                            localizer.format(end, "HH:mm", culture)
                    }}
                    showCurrentTimeIndicator={false}
                    dayLayoutAlgorithm="no-overlap"
                    onSelectEvent={this.handleSelectEvent}
                    date={this.state.selectedDay}
                    onNavigate={date => { this.handleDateChange(date); }}
                />

                {showPopUp && (
                    <div className="popup-overlay">
                        <div className="popup">
                            <h3>Edit assignment</h3>
                            <div>
                                <select
                                    value={selectedEvent.title}
                                    onChange={this.handleSelectChange}
                                >
                                    <option value="">Select employee</option>
                                    {filterEmployees.map((employee) => (
                                        <option key={employee.username} value={employee.username}>
                                            {employee.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div>
                                    <button onClick={this.handleSaveChanges}>Save changes</button>
                                    <button onClick={() => this.setState({ showPopUp: false })}>Close</button>
                                    <button onClick={this.handleDeleteEvent}>Delete assignment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {isAdmin === "true" && (<div>
                    <button className="thebutton" onClick={this.handleUpdateAssignments}>Save Changes</button>
                </div>)}
            </div>
        );
    }
}

function MainCalendar() {
    return <Layout PageName="Calendar" component={MyCalendar} />;
}

export default MainCalendar;