import React, { Component } from 'react';
import Post from './Post';
import { getByUserRequest } from '../actions/post';
import { connect } from 'react-redux';

class PostList extends Component {
    state = {
        list: []
    }

    componentDidMount() {
        const {startDate:start, endDate:end} = this.props.slotInfo;
        console.log(this.props.slotInfo)
        //해당 기간의 다이어리 목록 가져오기
        this.props.getPostListRequest(start, end)
            .then(() => {
                if (this.props.status === 'SUCCESS') {
                    this.setState({
                        list: this.props.postList
                    });
                } 
            });

    }

    render() {
        const titles = this.state.list.map(post => <Post key={post._id} post={post}></Post>)
        return (
            <div className="PostList">
                {titles}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.post.getByUser.status,
        postList: state.post.getByUser.list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPostListRequest: (start, end) => {
            return dispatch(getByUserRequest(start, end));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostList);