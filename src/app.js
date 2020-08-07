import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
import ROUTES from './global/routes'
import LandingPage from './screens/landing'
import SignUpScreen from './screens/auth/signup'
import SignInScreen from './screens/auth/signin'
import Home from './screens/home'
import { Provider } from 'unstated'


function PrivateRoute({ children, ...rest }) {
  return (
    <Route {...rest}
      render={({ location }) =>
        true  
        ? (children) 
        : (<Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider>
        <Router>
          <div style={{fontSize: 50}}>
            loading
          </div>
          <Route exact path={ROUTES.LANDING} component={LandingPage}/>
          <Route path={ROUTES.SIGN_UP} component={SignUpScreen}/>
          <Route path={ROUTES.SIGN_IN} component={SignInScreen}/>
          <PrivateRoute path={ROUTES.HOME}><Home/></PrivateRoute>
        </Router>
      </Provider>
    )
  }
}

export default App