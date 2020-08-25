import React, { Component, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { Provider, Subscribe } from "unstated";
import AuthRequest from "./global/api/auth";

import ROUTES from "./global/routes";
import LandingPage from "./screens/landing";
import SignUpScreen from "./screens/auth/signup";
import SignInScreen from "./screens/auth/signin";
import Home from "./screens/home";
import UserContainer from "./global/container/user";

function PrivateHomeRoute({ children, ...rest }) {
  let loaded = false;
  return (
    <Subscribe to={[UserContainer]}>
    {container => { 
      let user = null;
      if (!loaded) {
        AuthRequest.checkUser(localStorage.getItem("token"))
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

          if (location.state)
            thisUser = location.state.user

          return (user || thisUser || container.state.user) ? (
            <Home user={user || thisUser || container.state.user}/>
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
      <BrowserRouter>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpScreen} />
        <Route path={ROUTES.SIGN_IN} component={SignInScreen} />
        <PrivateHomeRoute path={ROUTES.HOME}>
          <Home />
        </PrivateHomeRoute>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
