import React, { Component } from "react";
// import { Route } from "react-router-dom";
import AuthRequest from "../../global/api/auth";
import "../../style/signin.scss";
import { Redirect, Router, Link, withRouter } from "react-router-dom";
import ROUTES from "../../global/routes";
import CircularProgress from '@material-ui/core/CircularProgress';

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      user: null,
      signedIn: false,
      loadingSignIn: false
    };
    // this.subscribeContainer = null;
  }
  inputHandler(e, title) {
    this.setState({
      [title]: e.target.value,
      errror: ''
    });
  }
  async submitHandler(e) {
    e.preventDefault();
    try {
      this.setState({loadingSignIn: true})
      let loginData = {
        email: this.state.email,
        password: this.state.password,
      };
      let user = await AuthRequest.signIn(loginData);
      localStorage.setItem("token", user.accessToken);
      this.props.history.push({
        pathname: ROUTES.HOME,
        state: { user: user }
      });
      this.setState({loadingSignIn: false})
    } catch (err) {
      this.setState({
        error: err.message,
        loadingSignIn: false
      });
    }
  }

  render() {
    return (
      <div>
        <div className="sign-in-screen-container">
          <div id="sign-in-logo">
            <div id="sign-in-label">Sign in to <span><Link to={ROUTES.LANDING}>teender</Link></span></div>
            {/* <img src={logo} height="29" /> */}
          </div>
          
          <form id="form-sign-in" onSubmit={(e) => this.submitHandler(e)}>
            <div className="sign-in-input-container">
              <label>Email Address</label>
              <input
                value={this.state.email}
                onChange={(e) => this.inputHandler(e, "email")}
                id="email"
                placeholder="Type your email"
                required
                type="email"
              ></input>
              <br></br>
              <label>Password</label>
              <input
                value={this.state.password}
                onChange={(e) => this.inputHandler(e, "password")}
                id="password"
                placeholder="Type your password"
                required
                type="Password"
              ></input>
              <div id="forgot-pass">
                <span>Forgot Password?</span>
              </div>
              {this.state.error == "" ? null : (
                <div id="error"> {this.state.error} </div>
              )}
              <button disabled={this.state.loadingSignIn}>
                {this.state.loadingSignIn ? <CircularProgress size={15} color="#a778b6"/> : "Sign In"}
              </button>
            </div>
            <div className="to-sign-up-container">
              <div id="ask-text">Don't have an account?</div>
              <div id="to-sign-up">
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default withRouter(SignInScreen);
