import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../../global/routes';
import 'src/style/landing.scss';
import { Subscribe } from 'unstated';
import UserContainer from '../../global/container/user';

function LandingPage() {  
  return (
  <Subscribe to={[UserContainer]}>
  {container => {
    console.log(container.state)
  return (<div id="landing">
    <div id="landing-bg">
      <div id="landing-bg-filter">
        <div id="landing-content">
          <div id="landing-title">teender</div>
          <div id="landing-sub-title">Swipe, connect, partner.</div>
          <div id="landing-signup">
            <Link className="link" id="landing-signup-button" to={ROUTES.SIGN_UP}>Sign up now ❤️</Link>
          </div>
          <div id="landing-auth">
            <Link className="link" id="landing-auth-button" to={ROUTES.HOME}>
              {!container.state.user 
                ? 'or Sign in'
                : <div>Sign in as <span id="landing-auth-user-name">{container.state.user.info.name || 'Guest'}</span></div>}
            </Link>
          </div>
          {!container.state.user 
            ? <div></div>
            : <Link className="link" id="landing-signin-button" to={ROUTES.SIGN_IN}>Not you? Sign in as another person</Link> }
        </div>
        
      </div>
    </div>
  </div>)}}
  </Subscribe>
)}
 
export default LandingPage;