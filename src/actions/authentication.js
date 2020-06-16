import {
    AUTH_LOGIN, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE,
    AUTH_REGISTER, AUTH_REGISTER_SUCCESS, AUTH_REGISTER_FAILURE,
    AUTH_GET_INFO, AUTH_GET_INFO_SUCCESS, AUTH_GET_INFO_FAILURE,
    AUTH_LEAVE, AUTH_LEAVE_SUCCESS, AUTH_LEAVE_FAILURE,
    AUTH_LOGOUT
} from './ActionTypes';
import axios from 'axios';

export function loginRequest(userid, password) {
    return (dispatch) => {
        dispatch(login());

        return axios.post('/user/login')
            .then(response => {
                dispatch(loginSuccess());
            }).catch(error => {
                dispatch(loginFailure());
            });
    };
};

export function login(){
    return {
        type: AUTH_LOGIN
    };
};

export function loginSuccess(){
    return {
        type: AUTH_LOGIN_SUCCESS
    };
};

export function loginFailure(){
    return {
        type: AUTH_LOGIN_FAILURE
    };
};