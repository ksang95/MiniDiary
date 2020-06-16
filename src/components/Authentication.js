import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';

class Authentication extends Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);