import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
import ROUTES from './global/routes'
import LandingPage from './screens/landing'
import SignUpScreen from './screens/auth/signup'
import SignInScreen from './screens/auth/signin'
import Home from './screens/home'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router>
        <div style={{fontSize: 50}}>
          loading
        </div>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpScreen} />
        <Route path={ROUTES.SIGN_IN} component={SignInScreen} />
        <Route path={ROUTES.HOME} component={Home} />
      </Router>
    )
  }
}

export default App