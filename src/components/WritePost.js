import React, { Component } from 'react';
import queryString from 'query-string';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Record, List } from 'immutable';
import { Button, Form, Col, Row, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux'
import { createRequest, updateRequest } from '../actions/post';
import { CirclePicker } from 'react-color';
import moment from 'moment';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import './writePost.css';
import DiaryEditor from './DiaryEditor';
import ko from 'date-fns/locale/ko';

registerLocale('ko', ko);

const Post = new Record({
    _id: null,
    start: '',
    end: '',
    title: '',
    content: '',
    color: '',
    files: List()
})


class WritePost extends Component {
    state = {
        isNew: true,
        post: Post({
            start: null,
            end: null,
            title: '',
            content: '',
            color: '#2ccce4',
            files: List()
        }),
        imageList: [],
        error: '',
        editorState: EditorState.createEmpty(),
        startDate: new Date(),
        endDate: new Date(),
    }

    componentDidMount() {
        if (this.props.location.pathname === '/diary/new') {
            const period = queryString.parse(this.props.location.search);
            this.setState({
                post: this.state.post.merge({ start: moment(period.start).toISOString(), end: moment(period.end).toISOString() }),
                startDate: new Date(period.start),
                endDate: new Date(period.end)
            });
        } else {
            const post = this.props.location.state.post;
            this.setState({
                isNew: false,
                post: Post(post),
                imageList: post.files,
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(post.content))),
                startDate: new Date(post.start),
                endDate: new Date(post.end)
            });

        }
    }

    handleStartDateChange = (date) => {
        let endDate = this.state.endDate;
        if (moment(date).diff(endDate) > 0)
            endDate = new Date(date);

        this.setState({
            post: this.state.post.set('start', moment(moment(date).format('YYYY-MM-DD')).toISOString()),
            startDate: new Date(date),
            endDate: endDate
        });
    }

    handleEndDateChange = (date) => {
        let startDate = this.state.startDate;
        if (moment(startDate).diff(date) > 0)
            startDate = new Date(date);

        this.setState({
            post: this.state.post.set('start', moment(moment(date).format('YYYY-MM-DD')).toISOString()),
            startDate: startDate,
            endDate: new Date(date)
        });
    }

    handleTitleChange = (e) => {
        this.setState({
            post: this.state.post.set('title', e.target.value)
        });
    }

    handleColorChange = (color) => {
        this.setState({
            post: this.state.post.set('color', color.hex)
        });
    }

    handleEditorChange = (editorState) => {
        this.setState({
            editorState
        });
    }

    handleSubmit = (e) => {
        const post = this.state.post.toJS();

        if (post.title === '') {
            return this.setState({
                error: '제목을 입력하세요.'
            })
        }
        post.content = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
        post.files = [];

        const deletedFiles = this.state.imageList.filter(image => {
            if (post.content.includes(image)) {
                post.files.push(image);
                return false;
            }
            return true;
        });

        //쓰지않는 이미지 삭제, 내용물 보내기
        if (this.state.isNew) {
            //다이어리 생성
            this.props.createRequest(post, deletedFiles)
                .then(() => {
                    if (this.props.create.status === 'FAILURE') {
                        this.setState({
                            error: '로그인이 필요한 페이지입니다.'
                        });
                    }
                    else {
                        this.props.history.push(`/diary/${this.props.create.id}`);
                    }
                });
        } else {
            //다이어리 수정
            this.props.updateRequest(post, deletedFiles)
                .then(() => {
                    if (this.props.update.status === 'FAILURE') {
                        const errorMessage = [
                            "로그인이 필요한 페이지입니다.",
                            "존재하지 않는 글입니다.",
                        ];

                        this.setState({
                            error: errorMessage[this.props.update.error - 1]
                        });
                    }
                    else {
                        this.props.history.push(`/diary/${post._id}`);
                    }
                })
        }


    }

    addImage = (image) => {
        this.setState({
            imageList: [
                ...this.state.imageList,
                image
            ]
        });
    }

    render() {
        const { title, color } = this.state.post;
        const { startDate, endDate,  error, editorState } = this.state;

        const backgroundStyle = {
            background: color,
        };

        return (
            <div className="WritePost" >
                <div>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                START DATE
                            </Form.Label>
                            <Col sm="4">
                                <DatePicker
                                    selected={startDate}
                                    onChange={this.handleStartDateChange}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    locale='ko'
                                />
                            </Col>
                            <Form.Label column sm="2">
                                END DATE
                            </Form.Label>
                            <Col sm="4">
                                <DatePicker
                                    selected={endDate}
                                    onChange={this.handleEndDateChange}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    locale='ko'
                                />
                            </Col>
                            <Col sm="1">
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2" htmlFor="title">
                                TITLE
                            </Form.Label>
                            <Col sm="10">
                                <FormControl type="text" id="title" name="title"
                                    value={title} onChange={this.handleTitleChange} autoFocus />
                            </Col>

                        </Form.Group>
                    </Form>
                </div>
                <DiaryEditor editorState={editorState} handleChange={this.handleEditorChange} addImage={this.addImage} readOnly={false} />
                <div className="color-picker-wrapper">
                    <div>Choose the background of title :
                    <div className='title-background-example' style={backgroundStyle}>Title</div>
                    </div>
                    <CirclePicker width="90%" color={color} onChangeComplete={this.handleColorChange}
                        colors={['#c4def6', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555',
                            '#dce775', '#ff8a65', '#ba68c8', '#FCB900', '#8BC34A']} />
                </div>
                <div className="error-message">{error}</div>
                <div className="submit-wrapper">
                    <Button variant="dark" className="submit" onClick={this.handleSubmit}>SUBMIT</Button>
                    <Button variant='outline-dark' onClick={()=>{ this.props.history.goBack()}}>BACK</Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        create: state.post.create,
        update: state.post.update
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createRequest: (post, deletedFiles) => {
            return dispatch(createRequest(post, deletedFiles));
        },
        updateRequest: (post, deletedFiles) => {
            return dispatch(updateRequest(post, deletedFiles))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WritePost);