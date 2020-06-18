import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest, getInfoRequest } from '../actions/authentication';

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
                <div>
                    <label htmlFor="userid">아이디</label>
                    <input type="text" id="userid" name="userid" value={this.state.userid}
                        onChange={this.handleChange} autoFocus></input>
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" name="password"
                        value={this.state.password} onChange={this.handleChange}></input>
                </div>
                <div><h4>{this.state.error}</h4></div>
                <div>
                    <button className="submit button"
                        onClick={this.handleClick}>로그인</button>
                </div>
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