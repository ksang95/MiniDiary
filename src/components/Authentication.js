import React, { Component } from 'react';
import SignUp from './SignUp';
import Login from './Login';
import { Button } from 'react-bootstrap';
import './authentication.css';

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
                <div style={{textAlign:'end'}}><Button variant="link" onClick={this.handleClick}> {this.state.isNew ? 'Go To login':'Go To Sign Up' }</Button></div>
            </div>
        );
    }
}

export default Authentication;