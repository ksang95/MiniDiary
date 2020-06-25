import React, { Component } from 'react';
import './videoAdd.css';
import { Button, Row, Form } from 'react-bootstrap';

class VideoAdd extends Component {
    state = {
        videoURL: '',
        open: false
    }

    componentDidMount() {
        document.addEventListener('click', (e) => {
            if (e.target.className !== 'VideoAdd' && !(/video-url.*/).test(e.target.className)) {
                this.setState({
                    videoURL: '',
                    open: false
                })
            }
        })
    }

    handleSubmit = (e) => {
        if (this.state.videoURL !== '')
            this.props.onChange(this.props.modifier(this.props.editorState, { src: this.state.videoURL }))
        this.setState({
            open: false
        })
    }

    handleChange = (e) => {
        this.setState({
            videoURL: e.target.value
        })
    }

    handleOpen = (e) => {
        this.setState({
            videoURL: '',
            open: !this.state.open
        })
    }

    render() {
        return (
            <div className="VideoAdd draftJsToolbar__buttonWrapper__1Dmqh">
                <button className="video-url-button draftJsToolbar__button__qi1gf" onClick={this.handleOpen}>
                    <img className='video-url-image' src='/pngwing.com.png' style={{ width: '20px' }} alt=''></img>
                </button>
                {this.state.open &&
                    <Row>
                        <div className='video-url-input-wrapper' id='video-url-input-wrapper'>
                            <Form.Control type="text" className='video-url-input' value={this.state.videoURL} onChange={this.handleChange} />
                            <Button variant='secondary' className='video-url-input-button sm-1' onClick={this.handleSubmit}>입력</Button>
                        </div>
                    </Row>
                }
            </div>
        );
    }
}

export default VideoAdd;