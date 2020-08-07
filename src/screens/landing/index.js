import React from 'react';
import { Link } from 'react-router-dom';
 
import ROUTES from '../../global/routes';
 
const LandingPage = () => (
  <div>
    <h1>Teender landing page!</h1>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Swipe now!</Link>
      </li>
    </ul>
  </div>
);
 
export default LandingPage;