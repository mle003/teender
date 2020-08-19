import React, { Component } from "react";
// import { Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import AuthRequest from "../../global/api/auth";
import MyContainer from "../../global/state";
import "../../style/signin.scss";
import { Subscribe } from "unstated";
import { Redirect, Router, Link, withRouter } from "react-router-dom";
import ROUTES from "../../global/routes";

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      user: null,
      signedIn: false
    };
    // this.subscribeContainer = null;
  }
  inputHandler(e, title) {
    this.setState({
      [title]: e.target.value,
    });
  }
  async submitHandler(e) {
    e.preventDefault();
    let loginData = {
      email: this.state.email,
      password: this.state.password,
    };
    try {
      let user = await AuthRequest.signIn(loginData);
      localStorage.setItem("token", user.accessToken);
      this.props.history.push({
        pathname: ROUTES.HOME,
        state: { user: user }
      });
    } catch (err) {
      this.setState({
        error: err.message,
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
              <button type="submit">Sign In</button>
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
