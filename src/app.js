import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Provider } from 'unstated'

import ROUTES from './global/routes'
import LandingPage from './screens/landing'
import SignUpScreen from './screens/auth/signup'
import SignInScreen from './screens/auth/signin'
import Home from './screens/home'

function PrivateHomeRoute({ children, ...rest }) {
  return (
    <Route {...rest}
      render={({ location }) =>
      // check user api here => return boolean
        false  
        ? (children) 
        : (<Redirect
            to={{
              pathname: ROUTES.SIGN_IN,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App() {
    return (
      // unstated
      <Provider>
        <Router>
          <Route exact path={ROUTES.LANDING} component={LandingPage}/>
          <Route path={ROUTES.SIGN_UP} component={SignUpScreen}/>
          <Route path={ROUTES.SIGN_IN} component={SignInScreen}/>
          <PrivateHomeRoute path={ROUTES.HOME}><Home/></PrivateHomeRoute>
        </Router>
      </Provider>
    )
  }

export default App