import React, { Component } from 'react';
import './post.css';
import moment from 'moment';

class Post extends Component {
    handleClick = (e) => {
        this.props.history.push(`/diary/${this.props.post._id}`);
    }

    render() {
        const { post } = this.props;
        const start = moment(post.start).format('MM-DD ddd');
        const end = moment(post.end).format('MM-DD ddd');

        return (
            <div className="Post">
                <div className="wrapper" style={{ backgroundColor: post.color }} onClick={this.handleClick}>
                    <div className="title-wrapper"><span className="title">{post.title}</span><span className="arrow">→</span></div>
                    <div className="info">
                        <div className="info-period"><span>{start}</span>{start !== end && (<><span>~</span><span>{end}</span></>)}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;