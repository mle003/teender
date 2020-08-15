import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Provider, Subscribe } from "unstated";
import MyRequest from "./global/api/request";

import ROUTES from "./global/routes";
import LandingPage from "./screens/landing";
import SignUpScreen from "./screens/auth/signup";
import SignInScreen from "./screens/auth/signin";
import Home from "./screens/home";
import MyContainer from "./global/state";

// function PrivateHomeRoute({ children, ...rest }) {
//   let loaded = false;
//   let user = null;
//   return (
    // <Subscribe to={[MyContainer]}>
    // {container => { 
    //   async function checkUser() {
    //     if (!loaded) {
    //       await MyRequest.checkUser(localStorage.getItem("token"))
    //       .then((res) => {
    //         console.log('res check user');
    //         console.log(res);

    //         user = res
    //         container.saveUserData(user)
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       }).finally(() => {
    //         loaded = true
    //       });
    //     }
    //     console.log('user')
    //     console.log(user)
    //   }
    //   checkUser()
    //   return <Route
    //     {...rest}
    //     render={({ location }) => {
    //       return (!!user || !!container.state.user) ? (
    //         children
    //       ) : (
    //           <Redirect
    //             to={{
    //               pathname: ROUTES.SIGN_IN,
    //               state: { from: location },
    //             }}
    //           />
    //         );
    //     }}
    // />}}
    // </Subscribe>
//   );
// }

class PrivateHomeRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      user: null,
      saved: false
    }
  }

  componentDidMount() {
    let {loaded} = this.state
    if (!loaded) {
      MyRequest.checkUser(localStorage.getItem("token"))
      .then((res) => {
        console.log('res check user');
        console.log(res)
        this.setState({ user: res, loaded: true })
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loaded: true })
      })
    }
  }
  render() {
    console.log(this.props)
    console.log(this.state.user)
    return (<Subscribe to={[MyContainer]}>
      {container => { 
        if (!this.state.saved) {
          container.saveUserData(this.state.user)
          this.setState({saved: true})
        }
        console.log('this.state.user')
            console.log(this.state.user)
            console.log('container.state.user')
            console.log(container.state.user)
        return <Route
          {...this.props}
          render={({ location }) => {
            return (!!this.state.user || !!container.state.user) ? (
              this.props.children
            ) : (
                <Redirect
                  to={{
                    pathname: ROUTES.SIGN_IN,
                    state: { from: location },
                  }}
                />
              );
          }}
      />}}
      </Subscribe>)
  }
}

function App() {
  return (
    // unstated
    <Provider>
      <Router>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpScreen} />
        <Route path={ROUTES.SIGN_IN} component={SignInScreen} />
        <PrivateHomeRoute path={ROUTES.HOME}>
          <Home />
        </PrivateHomeRoute>
      </Router>
    </Provider>
  );
}

export default App;
