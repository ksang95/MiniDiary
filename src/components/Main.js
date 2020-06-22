import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PostList from './PostList';
import { Modal, Button } from 'react-bootstrap'
import { getByUserRequest } from '../actions/post';

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
        let today = new Date();
        let start = new Date(today.getFullYear(), today.getMonth(), 1);
        let end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        this.getPostList(start, end);
    }

    getPostList = (start, end) => {
        console.log('start: '+start);
        console.log('end: '+end);

        this.props.getPostListRequest(start, end)
            .then(() => {
                if (this.props.status === 'SUCCESS') {
                    this.setState({
                        myEventsList: this.props.postList.map(post => {

                            return {
                                ...post,
                                start: new Date(post.start),
                                end: new Date(post.end),
                                allDay: true
                            }
                        })
                    });
                }
            });
    }


    handleSlotClick = (select) => {
        this.setState({
            isSlotSelected: true,
            slotInfo: {
                startDate: select.start,
                endDate: select.end
            }
        });
    }

    handleRange = (dates) => {
        if (dates.start)
            this.getPostList(dates.start, dates.end);
        else 
            this.getPostList(dates[0],dates[dates.length-1])
    }

    handleEventClick = (event) => {
        this.props.history.push(`/diary/${event._id}`);
    }

    handleClose = (e) => {
        this.setState({
            isSlotSelected: false
        })
    }

    render() {
        const { isLoggedIn } = this.props;
        const { myEventsList, isSlotSelected, slotInfo } = this.state;
        const localizer = momentLocalizer(moment);
        const start = moment(slotInfo.startDate).format('YYYY-MM-DD');
        const end = moment(slotInfo.endDate).format('YYYY-MM-DD');

        return (
            <div className="Main">
                <Calendar
                    defaultView={'month'}
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week']}
                    style={{ height: 600 }}
                    onSelectSlot={this.handleSlotClick}
                    onRangeChange={this.handleRange}
                    onSelectEvent={this.handleEventClick}
                    selectable
                    popup
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
                        <Modal.Title>{start === end ?
                            start : `${start} ~ ${end}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PostList
                            slotInfo={slotInfo}
                        ></PostList></Modal.Body>
                    <Modal.Footer>
                        {isLoggedIn ?
                            <Link to={`/new-diary?start=${start}&end=${end}`}>
                                <Button variant="primary">
                                    New diary
                            </Button>
                            </Link> :
                            <Link to="/login" className="mr-2"><Button>Create Your Diary With Login</Button></Link>}
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
        isLoggedIn: state.authentication.info.isLoggedIn,
        status: state.post.getByUser.status,
        postList: state.post.getByUser.list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPostListRequest: (start, end) => {
            return dispatch(getByUserRequest(start, end));
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);