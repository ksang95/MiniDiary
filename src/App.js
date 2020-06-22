import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authentication from './components/Authentication';
import { getInfoRequest, logoutRequest } from './actions/authentication';
import { Route, Switch } from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import WritePost from './components/WritePost';
import PostDetail from './components/PostDetail';

class App extends Component {

  componentDidMount() {
    const result = document.cookie.split(';').find(e => e.startsWith('user='));
    if (result) {
      const user = JSON.parse(atob(result.split('=')[1]));

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
    return (
      <div className="App">
        <Header isLoggedIn={this.props.info.isLoggedIn}
          nickname={this.props.info.currentUser.nickname}
          logoutRequest={this.props.logoutRequest}
        ></Header>
        <Route exact path="/" component={Main}></Route>
        <Switch>
          <Route path="/login" component={Authentication}></Route>
          <Route path="/new-diary" component={WritePost}></Route>
          <Route path="/diary/:id" component={PostDetail}></Route>
        </Switch>
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
    },
    logoutRequest: () => {
      return dispatch(logoutRequest());
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
