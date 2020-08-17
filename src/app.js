import React, { Component, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Provider, Subscribe } from "unstated";
import MyRequest from "./global/api/request";

import ROUTES from "./global/routes";
import LandingPage from "./screens/landing";
import SignUpScreen from "./screens/auth/signup";
import SignInScreen from "./screens/auth/signin";
import Home from "./screens/home";
import MyContainer from "./global/state";

function PrivateHomeRoute({ children, ...rest }) {
  let loaded = false;
  return (
    <Subscribe to={[MyContainer]}>
    {container => { 
      let user = null;
      if (!loaded) {
        MyRequest.checkUser(localStorage.getItem("token"))
        .then((res) => {
          console.log('res check user');
          console.log(res);
          user = res
          loaded = true
          container.saveUserData(user)
        })
        .catch((err) => {
          console.log(err);
          loaded = true
        })
      }
      return <Route
        {...rest}
        render={({ location }) => {
          let thisUser = null
          if (!!location.state)
            thisUser = location.state.user
          return (!!user || !!container.state.user || !!thisUser) ? (
            <Home user={thisUser || user || container.state.user}/>
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
    </Subscribe>
  );
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
