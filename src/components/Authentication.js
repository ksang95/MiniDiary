import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';
import SignUp from './SignUp';
import Login from './Login';

class Authentication extends Component {
    state = {
        isNew: false
    };

    handleClick = (e) => {
        this.setState({
            isNew: !this.state.isNew
        });
    }

    render() {
        return (
            <div className="Authentication">
                <div>
                    {this.state.isNew ? <SignUp history={this.props.history}></SignUp> : <Login history={this.props.history}></Login>}
                </div>
                <div><button onClick={this.handleClick}> {this.state.isNew ? '로그인':'회원가입' }</button></div>
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