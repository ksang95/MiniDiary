import {
    AUTH_LOGIN, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE,
    AUTH_REGISTER, AUTH_REGISTER_SUCCESS, AUTH_REGISTER_FAILURE,
    AUTH_GET_INFO, AUTH_GET_INFO_SUCCESS, AUTH_GET_INFO_FAILURE,
    AUTH_LEAVE, AUTH_LEAVE_SUCCESS, AUTH_LEAVE_FAILURE,
    AUTH_LOGOUT
} from './ActionTypes';
import axios from 'axios';

export function registerRequest(user) {
    return (dispatch) => {
        dispatch(register());
        return axios.post('/api/user/new-user', { user })
            .then(response => {
                dispatch(registerSuccess());
            }).catch(error => {
                dispatch(registerFailure(error.response.data.code));
            });
    };
};

export function register() {
    return {
        type: AUTH_REGISTER
    };
};

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS
    };
};

export function registerFailure(code) {
    return {
        type: AUTH_REGISTER_FAILURE,
        code
    };
};

export function loginRequest(userid, password) {
    return (dispatch) => {
        dispatch(login());

        return axios.post('/api/user/login', { userid, password })
            .then(response => {
                dispatch(loginSuccess());
            }).catch(error => {
                dispatch(loginFailure());
            });
    };
};

export function login() {
    return {
        type: AUTH_LOGIN
    };
};

export function loginSuccess() {
    return {
        type: AUTH_LOGIN_SUCCESS
    };
};

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
};

export function getInfoRequest() {
    return (dispatch) => {
        dispatch(getInfo());

        return axios.get('/api/user/me/info')
            .then(response => {
                dispatch(getInfoSuccess(response.data.info));
            }).catch(error => {
                dispatch(getInfoFailure());
            });
    };
};

export function getInfo() {
    return {
        type: AUTH_GET_INFO
    };
};

export function getInfoSuccess(info) {
    return {
        type: AUTH_GET_INFO_SUCCESS,
        info
    };
};

export function getInfoFailure() {
    return {
        type: AUTH_GET_INFO_FAILURE
    };
};

export function logoutRequest() {
    return (dispatch) => {

        return axios.post('/api/user/logout')
            .then(response => {
                dispatch(logout());
            });
    };
};

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
};