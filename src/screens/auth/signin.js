import React, { Component } from "react";
// import { Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import MyRequest from "../../global/api/request";
import MyContainer from '../../global/state'
import '../../style/signin.scss'
import { Subscribe } from "unstated";

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      user: null
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
      // MyContainer.saveUserData(user)
      this.setState({
        error: "",
        user: user
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
    <div>
      <Subscribe to={[MyContainer]}>
        {container => {
          let user = this.state.user
          if (user) {
            console.log(user)
            container.saveUserData(user)
            this.setState({ user: null })
            console.log(container)
          }
          return <div></div>;
        }}
      </Subscribe>
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
    </div>
    );
  }
}
export default SignInScreen;