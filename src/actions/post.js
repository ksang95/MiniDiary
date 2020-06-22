import {
    POST_CREATE, POST_CREATE_FAILURE, POST_CREATE_SUCCESS,
    POST_GET_BY_ID, POST_GET_BY_ID_FAILURE, POST_GET_BY_ID_SUCCESS,
    POST_GET_BY_USER, POST_GET_BY_USER_FAILURE, POST_GET_BY_USER_SUCCESS
} from './ActionTypes';
import axios from 'axios';

export function createRequest(post, deletedImages) {
    return (dispatch) => {
        dispatch(create());

        return axios.post('/api/post/new-post', { post, deletedImages })
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