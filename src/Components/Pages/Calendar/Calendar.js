import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../LayoutArea/Layout/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { GetTeamShifts } from "../../../actions/apiActions";

const localizer = momentLocalizer(moment);

class MyCalendar extends Component {
    state = {
        events: []
    };

    async componentDidMount() {
        // Call your GetUserEvents function to get events
        const userEvents = await GetTeamShifts(0);
        const eventToPresent = [];
        userEvents.shifts.forEach((userEvent) => {
            let color = userEvent.color
            let title = userEvent.title
            for (let i = 0; i < userEvent.start.length; i++) {
                let start = userEvent.start[i]
                let end = userEvent.end[i]
                eventToPresent.push({
                    start: moment(start).toDate(),
                    end: moment(end).toDate(),
                    title: title,
                    color: color
                })
            }
        });

        // Update state with the events
        this.setState({ events: eventToPresent });
    }

    // function to generate styles for each event based on its color property
    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.color
            }
        };
    };

    handleSelectEvent = (event) => window.alert(event.title);


    render() {
        return (
            <div className="MyCalendar">
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    events={this.state.events}
                    style={{ height: "80vh", border: "1px solid black", borderRadius: "10px", boxSizing: "border-box", overflow: "hidden" }}
                    defaultView="week"
                    views={["day", "week"]}
                    onView={(view) => this.setState({ view })}
                    eventPropGetter={this.eventStyleGetter} // apply custom styles to events
                    formats={{
                        timeGutterFormat: (date, culture, localizer) =>
                            localizer.format(date, "HH:mm", culture)
                    }}
                    showCurrentTimeIndicator={false}
                    dayLayoutAlgorithm="no-overlap"
                    onSelectEvent={this.handleSelectEvent}
                />
            </div>
        );
    }
}

function MainCalendar() {
    return <Layout PageName="Calendar" component={MyCalendar} />;
}

export default MainCalendar;
