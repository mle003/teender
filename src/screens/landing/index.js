import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../../global/routes';
import MyContainer from '../../global/state';
import 'src/style/landing.scss';
import { Subscribe } from 'unstated';

function LandingPage() {
  let validUser = false
  let container = new MyContainer()
  let user = container.state.user
  console.log(container.state)
  if (!!user) 
    validUser = true
  
  return (
  <Subscribe to={[MyContainer]}>
  {container => {
    console.log(container)
  return (<div id="landing">
    <div id="landing-bg">
      <div id="landing-bg-filter">
        <div id="landing-title">teender</div>
        <div id="landing-sub-title">Swipe, connect, partner.</div>
        {/* <div id="landing-signup"> */}
          <Link class="link" id="landing-signup-button" to={ROUTES.SIGN_UP}>Be a teender!</Link>
        {/* </div> */}
        <div id="landing-auth">
          <Link class="link" id="landing-auth-button" to={ROUTES.HOME}>
            {!container.state.user 
              ? 'Sign in now!'
              : `Sign in as ${container.state.user.info.name || 'Guest'}`}
          </Link>
        </div>
        {!container.state.user 
          ? <div></div>
          : <Link class="link" to={ROUTES.SIGN_IN}>Not you? Sign in as another person</Link> }
      </div>
    </div>
  </div>)}}
  </Subscribe>
)}
 
export default LandingPage;