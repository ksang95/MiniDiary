import React, { Component } from 'react';

class Post extends Component {
    state={
        post:{

        }
    }
    
    render() {
        const { post } = this.props;

        return (
            <div className="Post">
                <div>{post.title}</div>
            </div>
        );
    }
}

export default Post;