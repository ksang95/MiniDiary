import React, { Component } from 'react';
import Post from './Post';

class PostList extends Component {
    state = {
        list: [{_id:1234,title:'타이틀1'}, {_id:1235,title:'타이틀2'}, {_id:1236,title:'타이틀3'}, {_id:1237,title:'타이틀4'}]
    }

    componentDidMount() {
        //해당 기간의 다이어리 목록 가져오기


    }

    render() {
        const titles=this.state.list.map(post=><Post key={post._id} post={post}></Post>)
        return (
            <div className="PostList">
                {titles}
            </div>
        );
    }
}

export default PostList;