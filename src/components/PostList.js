import React, { Component } from 'react';
import Post from './Post';
import { getByUserRequest } from '../actions/post';
import { connect } from 'react-redux';

class PostList extends Component {
    state = {
        list: [],
        ready: false
    }

    componentDidMount() {
        const {startDate:start, endDate:end} = this.props.slotInfo;
        
        //해당 기간의 다이어리 목록 가져오기
        this.props.getPostListRequest(start, end)
            .then(() => {
                if (this.props.status === 'SUCCESS') {
                    this.setState({
                        list: this.props.postList
                    });
                } 
                this.setState({
                    ready: true
                })
            });

    }

    render() {
        const titles = this.state.list.map(post => <Post key={post._id} post={post} history={this.props.history}></Post>)
        return (
            <div className="PostList">
                {this.state.ready&&(titles.length>0?titles:<div>해당 기간의 다이어리가 존재하지 않습니다.</div>)}
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