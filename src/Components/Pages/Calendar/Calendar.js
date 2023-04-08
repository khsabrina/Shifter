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
        // Update state with the events
        this.setState({ events: userEvents });
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
                    style={{ height: "80vh" }}
                    view="week"
                    views={["week"]}
                    eventPropGetter={this.eventStyleGetter} // apply custom styles to events
                />
            </div>
        );
    }
}

function MainCalendar() {
    return <Layout PageName="Calendar" component={MyCalendar} />;
}

export default MainCalendar;
