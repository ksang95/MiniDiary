import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getByIdRequest, deletePostRequest } from '../actions/post';
import moment from 'moment';

class PostDetail extends Component {

    state = {
        start: '',
        end: '',
        title: '',
        content: '',
        color: '',
        error: ''
    }

    componentDidMount() {
        this.props.getPostRequest(this.props.match.params.id)
            .then(() => {
                if (this.props.getStatus === 'FAILURE') {
                    const errorMessage = [
                        "로그인이 되어있지 않습니다.",
                        "존재하지 않는 글입니다.",
                    ];

                    this.setState({
                        error: errorMessage[this.props.getError - 1]
                    });
                } else {
                    const { start, end } = this.props.post;

                    this.setState({
                        ...this.props.post,
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD'),
                    })
                }
            })
    }

    handleDelete = (e) => {
        this.props.deletePostRequest(this.state._id)
            .then(() => {
                if (this.props.deleteStatus === 'FAILURE') {
                    const errorMessage = [
                        "로그인이 되어있지 않습니다.",
                        "존재하지 않는 글입니다.",
                    ];

                    this.setState({
                        error: errorMessage[this.props.deleteError - 1]
                    });
                } else {
                    this.props.history.push('/');
                }
            })
    }

    render() {
        const { start, end, title, content, error } = this.state;

        return (
            <div className="PostDetail">
                <div>{error}</div>
                <div>{start === end ?
                    start : `${start} ~ ${end}`}</div>
                <div>{title}</div>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                <div>
                    <button>수정</button>
                    <button onClick={this.handleDelete}>삭제</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        getStatus: state.post.getById.status,
        post: state.post.getById.post,
        getError: state.post.getById.error,
        deleteStatus: state.post.delete.status,
        deleteError: state.post.delete.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPostRequest: (id) => {
            return dispatch(getByIdRequest(id));
        },
        deletePostRequest: (id) => {
            return dispatch(deletePostRequest(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);