import React, { Component } from 'react';
import queryString from 'query-string';
import ReactQuill, { Quill } from 'react-quill';
import { ImageUpload } from 'quill-image-upload';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Record } from 'immutable';
import { Button } from 'react-bootstrap';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import { connect } from 'react-redux'
import { createRequest } from '../actions/post';

Quill.register('modules/imageUpload', ImageUpload);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);


const Post = new Record({
    start: '',
    end: '',
    title: '',
    content: null
})

class WritePost extends Component {
    state = {
        post: Post({
            start: '2020-01-01',
            end: '2020-01-01',
            title: '',
            content: null
        }),
        imageList: [],
        error: '',
        value: ''
    }

    quill = null;

    componentDidMount() {
        const period = queryString.parse(this.props.location.search);
        this.setState({
            post: this.state.post.set('start', period.start),
            post: this.state.post.set('end', period.end)
        });
    }

    handleStartDateChange = (date) => {
        this.setState({
            post: this.state.post.set('start', date)
        });
    }

    handleEndDateChange = (date) => {
        this.setState({
            post: this.state.post.set('end', date)
        });
    }

    handleTitleChange = (e) => {
        this.setState({
            post: this.state.post.set('title', e.target.value)
        });
    }

    handleContentChange = (content, delta, source, editor) => {
        // console.log(editor.getHTML());
        // console.log(editor.getContents());
        this.setState({
            value: content
        });
    }

    handleSubmit = (e) => {
        const post = this.state.post;

        if (post.title === '') {
            return this.setState({
                error: '제목을 입력하세요.'
            })
        }


        const deletedImages = this.state.imageList.filter(image => {
            if (post.content.includes(image)) {
                return false;
            }
            return true;
        });

        //쓰지않는 이미지 삭제, 내용물 보내기
        this.props.createRequest(post, deletedImages)
            .then(() => {
                if (this.props.create.status === 'FAILURE') {
                    this.setState({
                        error: '로그인부터 해주세요.'
                    });
                }
                else {
                    this.props.history.push(`/post/${this.props.create.id}`);
                }
            });

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
        const { start, end, title, content } = this.state.post;
        const startDate = new Date(start);
        const endDate = new Date(end);

        const modules = {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
            },
            imageUpload: { //이거 적용하면서 에디터 내에서 이미지 드래그앤드롭이 안됨
                url: "/api/post/new-post/resource", // server url
                method: "POST", // change query method, default 'POST'
                name: 'images', // 아래 설정으로 image upload form의 key 값을 변경할 수 있다.
                callbackOK: (serverResponse, next) => { // 성공하면 리턴되는 함수
                    next(serverResponse.fileURL);
                    this.addImage(serverResponse.fileURL);
                    // this.quill.insertEmbed(10, 'image', serverResponse.fileURL);
                },
                callbackKO: (serverError) => { // 실패하면 리턴되는 함수
                    console.log(serverError);
                    // alert(serverError);
                },
                // optional
                // add callback when a image have been chosen
                checkBeforeSend: (file, next) => {
                    console.log(file);
                    next(file); // go back to component and send to the server
                }
            },
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            },
            imageDrop: true, // imageDrop 등록
            imageResize: {
                displayStyles: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: 'white'
                },
                modules: ['Resize', 'DisplaySize', 'Toolbar']
            } // imageResize 등록
        };

        const formats = [
            'header', 'font', 'color', 'background', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent', 'align',
            'link', 'image', 'video'
        ];

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
                <div>
                    <ReactQuill
                        ref={ref => { this.quill = ref; }}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        defaultValue={content}
                        onChange={this.handleContentChange}
                    />
                </div>
                <Button onClick={this.handleSubmit}>Create</Button>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        create: state.post.create
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createRequest: (post) => {
            return dispatch(createRequest(post));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WritePost);