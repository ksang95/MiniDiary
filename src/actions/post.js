import {
    POST_CREATE, POST_CREATE_FAILURE, POST_CREATE_SUCCESS,
    POST_GET_BY_ID, POST_GET_BY_ID_FAILURE, POST_GET_BY_ID_SUCCESS,
    POST_GET_BY_USER, POST_GET_BY_USER_FAILURE, POST_GET_BY_USER_SUCCESS,
    POST_DELETE, POST_DELETE_SUCCESS, POST_DELETE_FAILURE, FILE_UPLOAD, 
    POST_UPDATE, POST_UPDATE_FAILURE, POST_UPDATE_SUCCESS
} from './ActionTypes';
import axios from 'axios';

export function createRequest(post, deletedFiles) {
    return (dispatch) => {
        dispatch(create());

        return axios.post('/api/post/new-post', { post, deletedFiles })
            .then((response) => {
                dispatch(createSuccess(response.data.id));
            }).catch((error) => {
                dispatch(createFailure());
            });
    };
};

export function create() {
    return {
        type: POST_CREATE
    };
};

export function createSuccess(id) {
    return {
        type: POST_CREATE_SUCCESS,
        id
    };
};

export function createFailure() {
    return {
        type: POST_CREATE_FAILURE
    };
};

export function getByIdRequest(id) {
    return (dispatch) => {
        dispatch(getById());

        return axios.get(`/api/post/${id}`)
            .then((response) => {
                dispatch(getByIdSuccess(response.data.post));
            }).catch(error => {
                dispatch(getByIdFailure(error.response.data.code));
            });
    };
};

export function getById() {
    return {
        type: POST_GET_BY_ID
    };
};

export function getByIdSuccess(post) {
    return {
        type: POST_GET_BY_ID_SUCCESS,
        post
    };
};

export function getByIdFailure(code) {
    return {
        type: POST_GET_BY_ID_FAILURE,
        code
    };
};

export function getByUserRequest(start, end) {
    return (dispatch) => {
        dispatch(getByUser());

        return axios.get(`/api/post/my-posts`, { params: { start, end } })
            .then((response) => {
                dispatch(getByUserSuccess(response.data.list));
            }).catch((error) => {
                dispatch(getByUserFailure());
            });
    };
};

export function getByUser() {
    return {
        type: POST_GET_BY_USER
    };
};

export function getByUserSuccess(list) {
    return {
        type: POST_GET_BY_USER_SUCCESS,
        list
    };
};

export function getByUserFailure() {
    return {
        type: POST_GET_BY_USER_FAILURE,
    };
};

export function deletePostRequest(id) {
    return (dispatch) => {
        dispatch(deletePost());

        return axios.delete(`/api/post/${id}`)
            .then((response) => {
                dispatch(deletePostSuccess());
            }).catch((error) => {
                dispatch(deletePostFailure(error.response.data.code));
            })
    }
};

export function deletePost() {
    return {
        type: POST_DELETE
    };
};

export function deletePostSuccess() {
    return {
        type: POST_DELETE_SUCCESS
    };
};

export function deletePostFailure(code) {
    return {
        type: POST_DELETE_FAILURE,
        code
    };
};

export function updateRequest(post, deletedFiles) {
    return (dispatch) => {
        dispatch(update());

        return axios.put(`/api/post/${post._id}`, { post, deletedFiles })
            .then((response) => {
                dispatch(updateSuccess());
            }).catch((error) => {
                dispatch(updateFailure(error.response.data.code));
            });
    };
};

export function update(){
    return {
        type: POST_UPDATE
    };
};

export function updateSuccess(){
    return {
        type: POST_UPDATE_SUCCESS
    };
};

export function updateFailure(code){
    return {
        type: POST_UPDATE_FAILURE,
        code
    };
}

export function fileUploadRequest(formData) {
    return (dispatch) => {

        return axios.post('/api/post/new-resource', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                dispatch(fileUpload(response.data.fileURL));
            });
    };
};

export function fileUpload(fileURL) {
    return {
        type: FILE_UPLOAD,
        fileURL
    };
};