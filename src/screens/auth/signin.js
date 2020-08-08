import React, { Component } from "react";
// import { Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import MyRequest from "../../global/api/request";
import MyContainer from '../../global/state'

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
    };
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
      password: this.state.password
    }
    try {
      let user = await MyRequest.login(loginData)
      console.log(user)
      // MyContainer.saveUserData(user)
      console.log(MyContainer.state)
      this.setState({
        error: "",
      })
    } catch(err) {
      console.log(err)
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
        <form id="form-sign-in" onSubmit={e=>this.submitHandler(e)}>
          <div className="sign-in-input-container">
            <label>Email Address</label>
            <input
              value={this.state.email}
              onChange={e=>this.inputHandler(e, 'email')}
              id="email"
              placeholder="Type your email"
              required
              type="email"
            ></input>
            <br></br>
            <label>Password</label>
            <input
              value={this.state.password}
              onChange={e=>this.inputHandler(e, 'password')}
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
            <button>Sign In</button>
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