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
        events: [
            // {
            //     start: moment().set({ hour: 9, minute: 0, second: 0 }).toDate(),
            //     end: moment().set({ hour: 17, minute: 0, second: 0 }).toDate(),
            //     title: "Some title",
            //     color: "#FFC107" // custom color for this event
            // },
            // {
            //     start: moment().set({ hour: 12, minute: 0, second: 0 }).toDate(),
            //     end: moment().set({ hour: 20, minute: 0, second: 0 }).toDate(),
            //     title: "Other title",
            //     color: "#4CAF50" // custom color for this event
            // }
        ]
    };

    async componentDidMount() {
        // Call your GetUserEvents function to get events
        const userEvents = await GetTeamShifts();
        const eventToPresent = [];
        userEvents.events.forEach((userEvent) => {
            // const start_hour = 12;
            // const start_minute = 0;
            // const end_hour = 17;
            // const end_minute = 30;
            // const day = 7;
            // const month = 4;
            // const year = 2023;
            // const title = "title"
            // const color = "#4CAF50";
            // eventToPresent.push({
            //     start: moment().set({ hour: start_hour, minute: start_minute, second: 0 }).toDate(),
            //     end: moment().set({ hour: end_hour, minute: end_minute, second: 0 }).toDate(),
            //     title: title,
            //     color: color // custom color for this event
            // })
            eventToPresent.push({
                start: moment("2023-04-07T09:00:00").toDate(),
                end: moment("2023-04-08T07:00:00").toDate(),
                title: "Some title",
                color: "#FFC107" // custom color for this event
            })
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
                    timeGutterFormat="HH:mm"
                    formats={{
                        timeGutterFormat: (date, culture, localizer) =>
                            localizer.format(date, "HH:mm", culture)
                    }}
                    showCurrentTimeIndicator={false}
                />
            </div>
        );
    }
}

function MainCalendar() {
    return <Layout PageName="Calendar" component={MyCalendar} />;
}

export default MainCalendar;
