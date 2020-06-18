import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Main extends Component {
    state = {
        selectedView: 'month',
        myEventsList:[]
    }

    handleClick = (e) => {
        console.log(e)
    }

    onChange = (e) => {

    }

    render() {
        const { currentUser } = this.props;
        const { myEventsList } = this.state;
        const localizer = momentLocalizer(moment);

        return (
            <div className="Main">
                <Calendar
                    defaultView={'month'}
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week','day']}
                    style={{ height: 600 }}
                    onSelectSlot={this.handleClick}
                    selectable
                ></Calendar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.authentication.info.currentUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);