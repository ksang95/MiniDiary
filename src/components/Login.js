import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';

class Login extends Component {
    state = {
        id: '',
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
        this.props.loginRequest(this.state.id, this.state.password)
            .then(
                () => {
                    if (this.props.status === 'FAILURE') {
                        this.setState({
                            error: '아이디나 패스워드가 잘못 입력되었습니다.'
                        });
                    }
                    else {
                        window.confirm('로그인 성공');
                    }
                }
            )
    }

    render() {
        return (
            <div className="Login">
                <div>
                    <label for="id">ID</label>
                    <input type="text" id="id" name="id" value={this.state.id}
                        onChange={this.handleChange} autoFocus></input>
                </div>
                <div>
                    <label for="password">PASSWORD</label>
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);