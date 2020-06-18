import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <div>
                <span>
                    {this.props.isLoggedIn ? `${this.props.nickname}'s` : 'My'} Diary
                </span>
                <span><Link to="/login">로그인</Link></span>
            </div>
        );
    }
}

export default Header;