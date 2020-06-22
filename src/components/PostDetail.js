import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getByIdRequest } from '../actions/post';
import moment from 'moment';

class PostDetail extends Component {

    state = {
        start: '',
        end: '',
        title: '',
        content: '',
        error: ''
    }

    componentDidMount() {
        this.props.getPostRequest(this.props.match.params.id)
            .then(() => {
                if (this.props.status === 'FAILURE') {
                    const errorMessage = [
                        "로그인이 되어있지 않습니다.",
                        "존재하지 않는 글입니다.",
                    ];

                    this.setState({
                        error: errorMessage[this.props.error - 1]
                    });
                } else {
                    const { title, content, start, end } = this.props.post;

                    this.setState({
                        title: title,
                        content: content,
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD'),
                    })
                }
            })
    }

    render() {
        const { start, end, title, content, error } = this.state;

        return (
            <div className="PostDetail">
                <div>{start === end ?
                    start : `${start} ~ ${end}`}</div>
                <div>{title}</div>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                <div>{error}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.post.getById.status,
        post: state.post.getById.post,
        error: state.post.getById.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPostRequest: (id) => {
            return dispatch(getByIdRequest(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);