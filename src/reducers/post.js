import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {

};

export default function authentication(state, action) {
    if (typeof state === 'undefined')
        state = initialState;

    switch (action.type) {

        default:
            return state;

    }
};