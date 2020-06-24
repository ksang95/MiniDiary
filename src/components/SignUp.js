import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerRequest, getInfoRequest } from '../actions/authentication';
import { Button, Form } from 'react-bootstrap';


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
                    this.props.getInfoRequest();
                    this.props.history.push('/');
                }
            });
    }

    render() {
        const { user, error } = this.state;
        return (
            <div className="SignUp">
                <div className="title">SIGN UP</div>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="userid">ID</Form.Label>
                        <Form.Control type="text" id="userid" value={user.userid}
                            onChange={this.handleChange} autoFocus />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="nickname">NICKNAME</Form.Label>
                        <Form.Control type="text" id="nickname" value={user.nickname}
                            onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">PASSWORD</Form.Label>
                        <Form.Control type="password" id="password"
                            value={user.password} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            영문자, 숫자 포함 6자 이상 20자 이하
                        </Form.Text>
                    </Form.Group>
                    <div className="error-message">{error}</div>
                    <div className="submit-wrapper">
                        <Button variant="dark" className="submit"
                            onClick={this.handleClick}>SIGN UP</Button>
                    </div>
                </Form>
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