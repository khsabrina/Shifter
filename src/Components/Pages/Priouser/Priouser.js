import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../LayoutArea/Layout/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Priouser.css";
import { getWeekklyPref, updateWeekklyPref } from "../../../actions/apiActions";
// import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { format } from 'date-fns';

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


const localizer = momentLocalizer(moment);
class PrioUser extends Component {
    state = {
        events: [],
        selectedDay: new Date(),
        isPopupVisible: false,
        selectedEvent: null,
        eventId: 0,
        data: null
    };

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

    async componentDidMount() {
        let userPref = await getWeekklyPref();
        const events = [];
        let dailies = userPref.Dailies
        delete userPref["Dailies"]
        this.setState({ data: userPref });
        for (let i = 0; i < dailies.length; i++) {
            let date = dailies[i].Date
            let ShiftTypes = dailies[i].ShiftTypes
            for (let j = 0; j < ShiftTypes.length; j++) {
                const newEvent = {
                    title: ShiftTypes[j].ShiftName,
                    start: this.parseDateTime(date, ShiftTypes[j].StartHour),
                    end: this.parseDateTime(date, ShiftTypes[j].EndHour),
                    Color: ShiftTypes[j].Answer ? "#bee8ae" : "#ff6969",
                    id: this.state.eventId++,
                    prio: true
                };
                events.push(newEvent);
            }
        }
        this.setState({ events: events });
    }

    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.Color
            }
        };
    };

    handleDateChange = (date) => {
        this.setState({ selectedDay: date });
    }

    handleEventClick = (event) => {
        this.setState({ isPopupVisible: true, selectedEvent: event });
    }

    handleBlockShift = () => {
        const { selectedEvent } = this.state;
        selectedEvent.Color = "#ff6969"; // Change the event color to #ff6969 (red)
        selectedEvent.prio = false;
        this.setState({ isPopupVisible: false, selectedEvent });
    }

    handleUnblockShift = () => {
        const { selectedEvent } = this.state;
        selectedEvent.Color = "#bee8ae"; // Change the event color to #bee8ae (green)
        selectedEvent.prio = true;
        this.setState({ isPopupVisible: false, selectedEvent });
    }

    handleSaveChanges = () => {
        let baseData = this.state.data;
        const { events } = this.state;
        const sortedEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));
        const DailyShifts = [];
        let inside_data = { "Date": null };
        for (let i = 0; i < sortedEvents.length; i++) {
            if (inside_data["Date"] !== get_day_format(sortedEvents[i].start)) {
                if (inside_data["Date"] != null) {
                    DailyShifts.push(inside_data);
                }
                inside_data = {
                    "Date": parseInt(get_day_format(sortedEvents[i].start)),
                    "Constraints": null,
                    "ShiftTypes": []
                }
            }
            const prio = {
                "ShiftName": sortedEvents[i].title,
                "StartHour": parseInt(get_hour_format(sortedEvents[i].start)),
                "EndHour": parseInt(get_hour_format(sortedEvents[i].end)),
                "Answer": sortedEvents[i].prio
            }
            inside_data["ShiftTypes"].push(prio);
        }
        if (inside_data["Date"] != null) {
            DailyShifts.push(inside_data);
        }
        baseData["Dailies"] = DailyShifts;
        updateWeekklyPref(baseData);
    }

    renderPopup() {
        const { isPopupVisible, selectedEvent } = this.state;
        if (!isPopupVisible || !selectedEvent) {
            return null;
        }

        return (
            <div className="popup">
                <div className="popup-content">
                    <div>Title: {selectedEvent.title}</div>
                    <div>Start: {selectedEvent.start.toLocaleString()}</div>
                    <div>End: {selectedEvent.end.toLocaleString()}</div>
                    <div className="popup-buttons">
                        <button onClick={this.handleUnblockShift}>Unblock Shifts</button>
                        <button onClick={this.handleBlockShift}>Block Shift</button>
                    </div>
                </div>
            </div>
        );
    }


    render() {
        const { events, selectedDay } = this.state;
        return (
            <div className="calendar">
                {this.renderPopup()}
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
                </div>
                <Calendar
                    localizer={localizer}
                    events={events}
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
                    onSelectEvent={this.handleEventClick}
                    dayLayoutAlgorithm="no-overlap"
                    date={selectedDay}
                    onNavigate={date => { this.handleDateChange(date); }}
                />
                <button className="thebutton" onClick={this.handleSaveChanges}>Save Changes</button>
            </div>
        );
    }
}

function Priouser() {
    return <Layout PageName="Prioritizer" component={PrioUser} />;
}

export default Priouser;