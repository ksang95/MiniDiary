import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest, getInfoRequest } from '../actions/authentication';
import { Button, FormLabel, Form } from 'react-bootstrap';

class Login extends Component {
    state = {
        userid: '',
        password: '',
        error: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: ''
        });
    }

    handleClick = (e) => {
        const { userid, password } = this.state;
        this.props.loginRequest(userid, password)
            .then(
                () => {
                    if (this.props.status === 'FAILURE') {
                        this.setState({
                            error: '아이디나 패스워드가 잘못 입력되었습니다.'
                        });
                    }
                    else {
                        let loginData = {
                            isLoggedIn: true,
                            userid: userid
                        };
                        document.cookie = 'user=' + btoa(JSON.stringify(loginData));
                        this.props.getInfoRequest();
                        this.props.history.push('/');
                    }
                }
            )
    }

    render() {
        return (
            <div className="Login">
                <div className="title">LOGIN</div>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="userid">ID</Form.Label>
                        <Form.Control type="text" id="userid" value={this.state.userid} 
                        onChange={this.handleChange} autoFocus />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">PASSWORD</Form.Label>
                        <Form.Control type="password" id="password"
                            value={this.state.password} onChange={this.handleChange} />
                    </Form.Group>
                    <div className="error-message">{this.state.error}</div>
                    <div className="submit-wrapper">
                        <Button variant="dark" className="submit"
                            onClick={this.handleClick}>SIGN IN</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, password) => {
            return dispatch(loginRequest(id, password));
        },
        getInfoRequest: () => {
            return dispatch(getInfoRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);