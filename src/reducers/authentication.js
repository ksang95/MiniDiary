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
            id: '',
            nickname: ' '
        }
    }
};

export default function authentication(state, action) {
    if (typeof state == 'undefined')
        state= initialState;

    switch (action.type) {
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
        default:
            return state;

    }
};