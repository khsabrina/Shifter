import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../LayoutArea/Layout/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { GetTeamShifts } from "../../../actions/apiActions";
import Select from 'react-select';
import swal from 'sweetalert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'


const localizer = momentLocalizer(moment);
class MyCalendar extends Component {
    state = {
        events: [],
        selectedTitles: [],
        selectedDay: new Date(),
        lastDateGotShifts: new Date(),
    };

    handleChange = (selectedOptions) => {
        const selectedTitles = selectedOptions.map(option => option.value);
        this.setState({ selectedTitles });
    };

    async componentDidMount() {
        const userEvents = await GetTeamShifts(0);
        const events = userEvents.shifts.flatMap(shift => {
            const { color, title, start, end } = shift;
            if (title === localStorage.getItem("firstName")) {
                const selectedTitles = [title]
                this.setState({ selectedTitles })
            }
            return start.map((startDate, index) => ({
                start: moment(startDate).toDate(),
                end: moment(end[index]).toDate(),
                title,
                color
            }));
        });
        this.setState({ events });
    }

    // function to generate styles for each event based on its color property
    eventStyleGetter = event => {
        return {
            style: {
                backgroundColor: event.color
            }
        };
    };

    handleSelectEvent = (event) => swal({
        title: event.title,
        icon: 'info',
        button: 'OK'
    });

    handleDateChange = (date) => {
        const timeDifference = Math.abs(this.state.selectedDay.getTime() - date.getTime());

        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        this.setState({ selectedDay: date });
        if (daysDifference >= 75) {
            let formatedDate = format(date, 'yyyy/mm/dd');
            this.getShiftsToDate(formatedDate);
            this.setState({ lastDateGotShifts: date });
        }
    }

    async getShiftsToDate(date) {
        const userEvents = await GetTeamShifts(0, date);
        const events = userEvents.shifts.flatMap(shift => {
            const { color, title, start, end } = shift;
            if (title === localStorage.getItem("firstName")) {
                const selectedTitles = [title]
                this.setState({ selectedTitles })
            }
            return start.map((startDate, index) => ({
                start: moment(startDate).toDate(),
                end: moment(end[index]).toDate(),
                title,
                color
            }));
        });
        this.setState({ events });
    }


    render() {
        const { events, selectedTitles, selectedDay } = this.state;
        const titles = [...new Set(events.map(event => event.title))].sort(); // get unique titles and sort alphabetically
        const titleColorMap = events.reduce((map, event) => {
            map[event.title] = event.color;
            return map;
        }, {});
        const groupedOptions = groupByFirstLetter(titles).map(group => ({ // group options by first letter
            label: group.label,
            options: group.options.map(title => ({ value: title, label: title, color: titleColorMap[title] }))
        }));
        const colorStyles = {
            option: (styles, { data }) => { return { ...styles, color: data.color } },
            multiValue: (styles, { data }) => { return { ...styles, backgroundColor: data.color, color: "#fff" } },
            multiValueRemove: (styles, { data }) => { return { ...styles, color: "#fff", cursor: 'pointer' } },
            multiValueLabel: (styles, { data }) => { return { ...styles, color: "#fff" } },
        }
        const defaultSelectedOptions = selectedTitles.map(title => ({ value: title, label: title, color: titleColorMap[title] }));
        return (
            <div className="calendar">
                <div className="tool-bar">
                    <div className="select-menu-wrapper" >
                        <label htmlFor="select-menu" className="label-left">Select employees:</label>
                        <Select
                            options={groupedOptions}
                            isMulti
                            onChange={this.handleChange}
                            className="select-menu"
                            classNamePrefix="select"
                            styles={colorStyles}
                            value={defaultSelectedOptions}
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
                    events={events.filter(event => selectedTitles.includes(event.title))}
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
            </div>
        );
    }
}

function groupByFirstLetter(array) {
    const groups = {};
    for (let i = 0; i < array.length; i++) {
        const firstLetter = array[i].charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = {
                label: firstLetter,
                options: []
            };
        }
        groups[firstLetter].options.push(array[i]);
    }
    return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
}

function MainCalendar() {
    return <Layout PageName="Calendar" component={MyCalendar} />;
}

export default MainCalendar;