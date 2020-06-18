import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerRequest, getInfoRequest } from '../actions/authentication';


class SignUp extends Component {
    state = {
        user: {
            userid: '',
            password: '',
            nickname: ''
        },
        error: ''
    }

    handleChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.id]: e.target.value,
            },
            error: ''
        });
    }

    handleClick = (e) => {
        const user = this.state.user;

        if (user.userid === '' || user.password === '' || user.nickname === '') {
            this.setState({
                error: '항목을 모두 입력해주세요.'
            });

            return;
        }

        this.props.registerRequest(user)
            .then(() => {
                if (this.props.status === 'FAILURE') {
                    const errorMessage = [
                        "비밀번호를 규칙에 맞게 작성해주세요.",
                        "이미 가입된 아이디입니다.",
                    ];

                    this.setState({
                        error: errorMessage[this.props.error - 1]
                    });
                }
                else {
                    let loginData = {
                        isLoggedIn: true,
                        userid: user.userid
                    };
                    document.cookie = 'user=' + btoa(JSON.stringify(loginData));
                    // this.props.getInfoRequest();
                    this.props.history.push('/');
                }
            });
    }

    render() {
        const { user, error } = this.state;
        return (
            <div className="SignUp">
                <div>
                    <label htmlFor="userid">아이디</label>
                    <input type="text" id="userid" name="userid" value={user.userid}
                        onChange={this.handleChange} autoFocus></input>
                </div>
                <div>
                    <label htmlFor="nickname">별명</label>
                    <input type="text" id="nickname" name="nickname" value={user.nickname}
                        onChange={this.handleChange}></input>
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" name="password"
                        value={user.password} onChange={this.handleChange}></input>
                    <span>영문자, 숫자 포함 6자 이상 20자 이하</span>
                </div>
                <div><h4>{error}</h4></div>
                <div>
                    <button className="submit button"
                        onClick={this.handleClick}>가입하기</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        error: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (user) => {
            return dispatch(registerRequest(user));
        },
        getInfoRequest: () => {
            return dispatch(getInfoRequest());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);