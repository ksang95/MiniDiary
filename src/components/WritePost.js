import React, { Component } from 'react';
import queryString from 'query-string';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Record, List } from 'immutable';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { createRequest, updateRequest } from '../actions/post';
import { CirclePicker } from 'react-color';
import moment from 'moment';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import './writePost.css';
import DiaryEditor from './DiaryEditor';

const Post = new Record({
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
        editorState: EditorState.createEmpty()
    }

    componentDidMount() {
        if (this.props.location.pathname === '/diary/new') {
            const period = queryString.parse(this.props.location.search);
            this.setState({
                post: this.state.post.merge({ start: moment(period.start).toISOString(), end: moment(period.end).toISOString() })
            });
        } else {
            const post = this.props.location.state.post;

            this.setState({
                isNew: false,
                post: post,
                imageList: post.files,
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)))
            });

        }
    }

    handleStartDateChange = (date) => {
        this.setState({
            post: this.state.post.set('start', moment(date).toISOString())
        });
    }

    handleEndDateChange = (date) => {
        this.setState({
            post: this.state.post.set('end', moment(date).toISOString())
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
        console.log(post)
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
                            error: '로그인이 되어있지 않습니다.'
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
                            "로그인이 되어있지 않습니다.",
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

    addImage = (url) => {
        this.setState({
            imageList: [
                ...this.state.imageList,
                url
            ]
        });
    }


    render() {
        const { start, end, title, color } = this.state.post;
        const startDate = new Date(start);
        const endDate = new Date(end);

        const backgroundStyle = {
            background: color,
        };

        return (
            <div className="WritePost" >
                <div>
                    <div>
                        START DATE : <DatePicker
                            selected={startDate}
                            onChange={this.handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                    <div>
                        END DATE : <DatePicker
                            selected={endDate}
                            onChange={this.handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </div>
                </div>
                <label htmlFor="title">TITLE :</label>
                <input type="text" id="title" name="title"
                    value={title} onChange={this.handleTitleChange} autoFocus></input>
                <DiaryEditor editorState={this.state.editorState} handleChange={this.handleEditorChange} addImage={this.addImage} readOnly={false} />
                <div>
                    <div>제목 배경 색상
                    <div className='title-background-example' style={backgroundStyle}>Title</div>
                    </div>
                    <CirclePicker color={color} onChangeComplete={this.handleColorChange}
                        colors={['#c4def6', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555',
                            '#dce775', '#ff8a65', '#ba68c8', '#FCB900', '#8BC34A']} />
                </div>
                <div>{this.state.error}</div>
                <Button onClick={this.handleSubmit}>{this.state.isNew ? 'Create' : 'Update'}</Button>

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