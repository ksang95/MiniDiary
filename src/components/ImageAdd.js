import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fileUploadRequest } from '../actions/post';
import './imageAdd.css';

class ImageAdd extends Component {
    handleChange = (e) => {
        if (e.target.files[0].size > 600000) {
            alert("파일 크기 제한 - 600KB 이하");
        } else {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            this.props.fileUploadRequest(formData)
                .then(() => {
                    this.props.modifier(this.props.fileURL)
                });
        }

    }

    render() {
        return (
            <div className="ImageAdd draftJsToolbar__buttonWrapper__1Dmqh">
                <label className="draftJsToolbar__button__qi1gf" for="file"><img src="/iconfinder_icon-image_211677.png"></img></label>
                <input type="file" id="file" name="file" accept="image/*" onChange={this.handleChange} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fileURL: state.post.file.url
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fileUploadRequest: (formData) => {
            return dispatch(fileUploadRequest(formData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageAdd);