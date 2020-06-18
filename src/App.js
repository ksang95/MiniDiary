import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authentication from './components/Authentication';
import { getInfoRequest } from './actions/authentication';
import { Route } from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';

class App extends Component {

  componentDidMount() {
    const result = document.cookie.split(';').find(e => e.startsWith('user='));
    if (result) {
      const user = JSON.parse(atob(result.split('=')[1]));
      console.log(user)

      if (!user.isLoggedIn)
        return;

      this.props.getInfoRequest()
        .then(() => {
          if (!this.props.info.valid) {
            let loginData = {
              isLoggedIn: false,
              userid: ''
            };

            document.cookie = 'user=' + btoa(JSON.stringify(loginData));
          }
        });
    }
  }

  render() {
    console.log(this.props.info);
    return (
      <div className="App">
        <Header isLoggedIn={this.props.info.isLoggedIn}
          nickname={this.props.info.currentUser.nickname}
        ></Header>
        <Route path="/" component={Main}></Route>
        <Route path="/login" component={Authentication}></Route>
        <Route path=""></Route>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.authentication.info,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfoRequest: () => {
      return dispatch(getInfoRequest());
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
