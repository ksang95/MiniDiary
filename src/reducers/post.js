import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    create: {
        status: 'INIT',
        id: -1
    },
    getById: {
        status: 'INIT',
        error: -1,
        post: null
    },
    getByUser: {
        status: 'INIT',
        error: -1,
        list: []
    },
    delete: {
        status: 'INIT',
        error: -1
    }
};

export default function authentication(state, action) {
    if (typeof state === 'undefined')
        state = initialState;

    switch (action.type) {
        case types.POST_CREATE:
            return update(state, {
                create: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.POST_CREATE_SUCCESS:
            return update(state, {
                create: {
                    status: { $set: 'SUCCESS' },
                    id: { $set: action.id }
                }
            });
        case types.POST_CREATE_FAILURE:
            return update(state, {
                create: {
                    status: { $set: 'FAILURE' }
                }
            });
        case types.POST_GET_BY_ID:
            return update(state, {
                getById: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.POST_GET_BY_ID_SUCCESS:
            return update(state, {
                getById: {
                    status: { $set: 'SUCCESS' },
                    post: { $set: action.post }
                }
            });
        case types.POST_GET_BY_ID_FAILURE:
            return update(state, {
                getById: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.code }
                }
            });
        case types.POST_GET_BY_USER:
            return update(state, {
                getByUser: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.POST_GET_BY_USER_SUCCESS:
            return update(state, {
                getByUser: {
                    status: { $set: 'SUCCESS' },
                    list: { $set: action.list }
                }
            });
        case types.POST_GET_BY_USER_FAILURE:
            return update(state, {
                getByUser: {
                    status: { $set: 'FAILURE' }
                }
            });
        case types.POST_DELETE:
            return update(state, {
                delete: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.POST_DELETE_SUCCESS:
            return update(state, {
                delete: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.POST_DELETE_FAILURE:
            return update(state, {
                delete: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.code }
                }
            });
        default:
            return state;

    }
};