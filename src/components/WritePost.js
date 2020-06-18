import React, { Component } from 'react';
import queryString from 'query-string';
import ReactQuill, { Quill } from 'react-quill';
import { ImageUpload } from 'quill-image-upload';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Record } from 'immutable';
import { Button } from 'react-bootstrap';

Quill.register('modules/imageUpload', ImageUpload);

const Period = new Record({
    start: '',
    end: ''
});

class WritePost extends Component {
    state = {
        period: Period({
            start: '2020-01-01',
            end: '2020-01-01'
        })
    }


    componentDidMount() {
        const period = queryString.parse(this.props.location.search);
        console.log(period)
        this.setState({
            period: Period(period)
        });
    }

    handleStartDateChange = (date) => {
        this.setState({
            period: this.state.period.set('start', date)
        })
    }

    handleEndDateChange = (date) => {
        this.setState({
            period: this.state.period.set('end', date)
        })
    }

    handleContentChange = (content, delta, source, editor) => {
        console.log(editor.getContents());
    }

    handleSubmit = (e) => {

    }

    render() {
        const { start, end } = this.state.period;
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
                // container:  [['bold', 'italic', 'underline', 'blockquote'],
                // [{'list': 'ordered'}, {'list': 'bullet'}],
                // ['formula','link', 'image'],
                // ['clean']],
                // handlers: { 'image' : this.handleImage }
            },
            imageUpload: {
                url: "<내 image upload API 주소>", // server url
                method: "POST", // change query method, default 'POST'
                name: 'images', // 아래 설정으로 image upload form의 key 값을 변경할 수 있다.
                callbackOK: (serverResponse, next) => { // 성공하면 리턴되는 함수
                    next(serverResponse);
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
            // imageDrop: true, // imageDrop 등록
            // imageResize: {} // imageResize 등록
        };

        const formats = [
            'header', 'font', 'color', 'background', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent', 'align',
            'link', 'image', 'video'
        ];

        return (
            <div className="WritePost">
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
                <label htmlFor="title">TITLE :</label><input type="text" id="title" name="title" autoFocus></input>
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={this.handleContentChange} />
                <Button onClick={this.handleSubmit}>Create</Button>
            </div>
        );
    }
}

export default WritePost;