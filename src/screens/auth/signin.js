import React, { Component } from "react";
// import { Route } from "react-router-dom";
import logo from "../assets/logo.png";
import MyRequest from "../../global/api/request";
// import Axios from "axios";
impor
class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
    };
    this.passwordHandler = this.passwordHandler.bind(this);
    this.emailHandler = this.emailHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }
  emailHandler(e) {
    let target = e.target;
    // let email = document.querySelector("#email")
    // let password = document.querySelector("#password")
    this.setState({
      email: target.value,
    });
  }
  passwordHandler(e) {
    let target = e.target;
    // let email = document.querySelector("#email")
    // let password = document.querySelector("#password")
    this.setState({
      password: target.value,
    });
  }
  async submitHandler(e) {
    e.preventDefault();
    let { email, password } = this.state;
    let loginData = {email: email, password: password}
    try {
      let user = await MyRequest.login(loginData)
      this.setState({
        error: "",
      })
    } catch(err) {
      this.setState({
        error: err.message,
      })
    }

  }
  
  render() {
    return (
      <div className="sign-in-screen-container">
        <div id="sign-in-logo">
          <img src={logo} height="29" />
        </div>
        <div id="sign-in-label">Sign in to Teender</div>
        <form id="form-sign-in" onSubmit={this.submitHandler}>
          <div className="sign-in-input-container">
            <label>Email Address</label>
            <input
              value={this.state.email}
              onChange={this.emailHandler}
              id="email"
              placeholder="Type your email"
              required
              type="email"
            ></input>
            <br></br>
            <label>Password</label>
            <input
              value={this.state.password}
              onChange={this.passwordHandler}
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
            <div id="ask-text">Have not account yet?</div>
            <div id="to-sign-up">Sign Up</div>
          </div>
        </form>
      </div>
    );
  }
}
export default SignInScreen;