import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getByIdRequest, deletePostRequest } from '../actions/post';
import moment from 'moment';
import { List, Record } from 'immutable';
import { Link } from 'react-router-dom';
import { EditorState, convertFromRaw } from 'draft-js';
import DiaryEditor from './DiaryEditor';

const Post = new Record({
    _id: '',
    writer: '',
    title: '',
    content: '',
    color: '',
    start: '',
    end: '',
    files: List(),
    created: '',
})

class PostDetail extends Component {

    state = {
        post: Post(),
        error: '',
        editorState: EditorState.createEmpty()
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
                    const { start, end, content } = this.props.post;
                    
                    this.setState({
                        post: Post({
                            ...this.props.post,
                            start: moment(start).format('YYYY-MM-DD'),
                            end: moment(end).format('YYYY-MM-DD'),
                        }),
                        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
                    });
                }
            })
    }

    handleDelete = (e) => {
        this.props.deletePostRequest(this.state.post._id)
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


    handleEditorChange = (editorState) => {
        this.setState({
            editorState
        });
    }

    render() {
        const { start, end, title, content } = this.state.post;

        return (
            <div className="PostDetail">
                {this.state.error.length !== 0 ?
                    <div>{this.state.error}</div> :
                    <div>
                        <div>{start === end ?
                            start : `${start} ~ ${end}`}</div>
                        <div>{title}</div>
                        {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
                        <DiaryEditor editorState={this.state.editorState} handleChange={this.handleEditorChange} readOnly={true} />
                        <div>
                            <Link to={{ pathname: '/diary/update', state: { post: this.state.post } }} ><button>수정</button></Link>
                            <button onClick={this.handleDelete}>삭제</button>
                        </div>
                    </div>
                }
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