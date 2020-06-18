import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PostList from './PostList';
import { Modal, Button } from 'react-bootstrap'

class Main extends Component {
    state = {
        selectedView: 'month',
        myEventsList: [],
        isSlotSelected: false,
        slotInfo: {
            startDate: '',
            endDate: '',
        }
    }

    componentDidMount() {
        if (this.props.currentUser.isLoggedIn) {

        }
        else {
            this.setState({
                myEventsList: [
                    {
                        title: '가족 여행',
                        start: new Date('2020-06-02'),
                        end: new Date('2020-06-03'),
                        allDay: true,
                        color: 'blue'
                    },
                    {
                        title: '미니 프로젝트',
                        start: new Date('2020-06-10'),
                        end: new Date('2020-06-18'),
                        allDay: true,
                        color: 'green'
                    }
                ]
            })
        }
    }


    handleClick = (e) => {
        this.setState({
            isSlotSelected: true,
            slotInfo: {
                startDate: moment(e.start).format('YYYY-MM-DD'),
                endDate: moment(e.end).format('YYYY-MM-DD')
            }
        });
    }

    handleClose = (e) => {
        this.setState({
            isSlotSelected: false
        })
    }

    render() {
        const { currentUser } = this.props;
        const { myEventsList, isSlotSelected, slotInfo } = this.state;
        const localizer = momentLocalizer(moment);

        return (
            <div className="Main">
                <Calendar
                    defaultView={'month'}
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    style={{ height: 600 }}
                    onSelectSlot={this.handleClick}
                    selectable
                    components={{
                        // dateCellWrapper:Slot
                    }}
                    eventPropGetter={
                        (event, start, end, isSelected) => {
                            return {
                                style: {
                                    height: '25px',
                                    fontSize: '10pt',
                                    backgroundColor: event.color
                                }
                            }
                        }
                    }
                ></Calendar>
                <Modal show={isSlotSelected} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                <Modal.Title>{slotInfo.startDate===slotInfo.endDate?
                slotInfo.startDate:`${slotInfo.startDate} ~ ${slotInfo.endDate}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PostList
                            slotInfo={slotInfo}
                        ></PostList></Modal.Body>
                    <Modal.Footer>
                        <Link to={`/new-diary?start=${slotInfo.startDate}&end=${slotInfo.endDate}`}>
                            <Button variant="primary">
                                New diary
                            </Button>
                        </Link>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
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