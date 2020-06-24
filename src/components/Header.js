import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar,  Button } from 'react-bootstrap';
import './header.css';
import { connect } from 'react-redux';

class Header extends Component {

    handleLogout = (e) => {
        this.props.logoutRequest()
            .then(() => {
                let loginData = {
                    isLoggedIn: false,
                    userid: ''
                };

                document.cookie = 'user=' + btoa(JSON.stringify(loginData));
            });
    }

    render() {
        const loggedInHeader = (<Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/" className="ml-2 mr-auto">
                <span>{`${this.props.nickname}'s MiniDiary`}</span>
                <span className={'logged-in-brand'}>My MiniDiary</span>
            </Navbar.Brand>
            <Button onClick={this.handleLogout} className="mr-2">LOGOUT</Button>
        </Navbar>);

        const loggedOutHeader = (<Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/" className="ml-2 mr-auto">
                <span className={'logged-out-brand'}>My MiniDiary</span>
            </Navbar.Brand>
            <Link to="/login" className="mr-2"><Button>LOGIN</Button></Link>
        </Navbar>);

        return (
            <header>
                {this.props.isLoggedIn ? loggedInHeader : loggedOutHeader}
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);