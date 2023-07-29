import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../LayoutArea/Layout/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Priouser.css";
import { GetTeamShifts } from "../../../actions/apiActions";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';


const localizer = momentLocalizer(moment);
class PrioUser extends Component {
    state = {
        events: [],
        selectedDay: new Date(),
        isPopupVisible: false,
        selectedEvent: null
    };

    async componentDidMount() {
        const events = [
            {
                "title": "morning",
                "start": new Date("2023-07-23T05:00:00.000Z"),
                "end": new Date("2023-07-23T13:00:00.000Z"),
                "Color": "#bee8ae",
                "id": 0,
            }
        ]
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
        this.setState({ isPopupVisible: false, selectedEvent });
    }

    handleUnblockShift = () => {
        const { selectedEvent } = this.state;
        selectedEvent.Color = "#bee8ae"; // Change the event color to #bee8ae (green)
        this.setState({ isPopupVisible: false, selectedEvent });
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
                <button className="thebutton" onClick={{}}>Save Changes</button>
            </div>
        );
    }
}

function Priouser() {
    return <Layout PageName="Priouser" component={PrioUser} />;
}

export default Priouser;