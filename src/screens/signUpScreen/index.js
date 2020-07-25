import React, { Component } from "react";
import logo from "../../assets/logo.png";

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="signup-screen">
        <div id="nav-logo">
          <img src={logo} height="30" />
        </div>
      </div>
    );
  }
}

export default SignUpScreen;
