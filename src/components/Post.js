import React, { Component } from 'react';
import './post.css';
import moment from 'moment';

class Post extends Component {
    handleClick = (e) => {
        this.props.history.push(`/diary/${this.props.post._id}`);
    }

    render() {
        const { post } = this.props;
        const start = moment(post.start).format('MM월 DD일');
        const end = moment(post.end).format('MM월 DD일');

        return (
            <div className="Post">
                <div className="wrapper" style={{ backgroundColor: post.color }} onClick={this.handleClick}>
                    <div className="title">{post.title}</div>
                    <div className="info">
                        <div>시작: {start} 끝: {end}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;