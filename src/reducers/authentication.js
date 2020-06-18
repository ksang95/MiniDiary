import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    login: {
        status: 'INIT'
    },
    register: {
        status: 'INIT',
        error: -1
    },
    info: {
        valid: false,
        isLoggedIn: false,
        currentUser: {
            userid: '',
            nickname: ' '
        }
    }
};

export default function authentication(state, action) {
    if (typeof state === 'undefined')
        state = initialState;

    switch (action.type) {
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.code }
                }
            });
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' }
                }
            });
        case types.AUTH_GET_INFO:
            return update(state, {
                info: {
                    isLoggedIn: { $set: true }
                }
            });
        case types.AUTH_GET_INFO_SUCCESS:
            return update(state, {
                info: {
                    valid: { $set: true },
                    currentUser: {
                        userid: { $set: action.info.userid },
                        nickname: { $set: action.info.nickname }
                    }
                }
            });
        case types.AUTH_GET_INFO_FAILURE:
            return update(state, {
                info: {
                    valid: { $set: false },
                    isLoggedIn: { $set: false }
                }
            });
        default:
            return state;

    }
};