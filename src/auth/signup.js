import React, { Component, useState } from "react";
import logo from "../../assets/logo.png";
import DatePicker from "react-date-picker";
import axios from "../home/card/node_modules/axios";

class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      registerInfo: { birthday: new Date().toISOString(), gender: "male" },
      validationError: {},
      selectedGender: "male",
    };
  }

  handleValidation() {
    let registerInfo = this.state.registerInfo;
    let errors = {};
    let isValid = true;

    if (!registerInfo["firstName"]) {
      isValid = false;
      errors["firstName"] = "Missing First Name";
    }

    if (!registerInfo["lastName"]) {
      isValid = false;
      errors["lastName"] = "Missing Last Name";
    }

    if (!registerInfo["email"]) {
      isValid = false;
      errors["email"] = "Missing Email";
    }

    if (!registerInfo["password"]) {
      isValid = false;
      errors["password"] = "Missing Password";
    }

    this.setState({ validationError: errors });
    return isValid;
  }

  handleChange(field, e) {
    let registerInfo = this.state.registerInfo;
    registerInfo[field] = e.target.value;
    this.setState({ registerInfo });
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitHandler(e) {
    let registerInfo = this.state.registerInfo;
    console.log(registerInfo);
    let {
      firstName,
      lastName,
      email,
      password,
      gender,
      birthday,
      profilePic,
    } = registerInfo;
    let name = firstName + " " + lastName;
    console.log(name);
    console.log(password);

    e.preventDefault();
    if (this.handleValidation()) {
      axios
        .request({
          url: "http://localhost:9000/api/auth/sign-up",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            name,
            email,
            password,
            gender,
            birthday,
            profilePic,
          },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } else {
      alert("Form has errors.");
    }
  }

  handleInputChange(event) {
    let registerInfo = this.state.registerInfo;
    registerInfo["gender"] = event.target.name;
    this.setState({ selectedGender: event.target.name });
  }

  handleDateChange(event) {
    let registerInfo = this.state.registerInfo;
    registerInfo["birthday"] = event.target.name;
  }

  pictureHandler(event) {
    // console.log(event.target.files[0]);
    let registerInfo = this.state.registerInfo;
    registerInfo["profilePic"] = event.target.files[0];
  }

  render() {
    return (
      <form id="signup-screen" onSubmit={this.submitHandler.bind(this)}>
        <div id="signup-logo">
          <img src={logo} height="30" />
        </div>
        <h1>Create Account</h1>
        <div id="signup-form">
          <div id="user-name">
            <div id="first-name" className="name">
              <label>
                First Name:
                <input
                  type="text"
                  value={this.state.registerInfo["firstName"]}
                  onChange={this.handleChange.bind(this, "firstName")}
                />
                <div id="firstname-error" className="message-error">
                  {this.state.validationError["firstName"]}
                </div>
              </label>
            </div>
            <div id="last-name" className="name">
              <label>
                Last Name:
                <input
                  type="text"
                  value={this.state.registerInfo["lastName"]}
                  onChange={this.handleChange.bind(this, "lastName")}
                />
                <div id="lastname-error" className="message-error">
                  {this.state.validationError["lastName"]}
                </div>
              </label>
            </div>
          </div>
          <div id="gender">
            <label>
              Gender:
              <div id="gender-options">
                <div>
                  <label className="gender-option">
                    Male
                    <input
                      type="radio"
                      name="male"
                      value="male"
                      checked={this.state.selectedGender === "male"}
                      onChange={this.handleInputChange.bind(this)}
                    />
                  </label>
                </div>
                <div>
                  <label className="gender-option">
                    Female
                    <input
                      type="radio"
                      name="female"
                      value="female"
                      checked={this.state.selectedGender === "female"}
                      onChange={this.handleInputChange.bind(this)}
                    />
                  </label>
                </div>
              </div>
            </label>
          </div>

          <div id="account">
            <div id="username" className="account-info">
              <label>
                Email Address:
                <input
                  type="email"
                  value={this.state.registerInfo["email"]}
                  onChange={this.handleChange.bind(this, "email")}
                />
                <div id="email-error" className="message-error">
                  {this.state.validationError["email"]}
                </div>
              </label>
            </div>
            <div id="password" className="account-info">
              <label>
                Password:
                <input
                  type="password"
                  value={this.state.registerInfo["password"]}
                  onChange={this.handleChange.bind(this, "password")}
                />
                <div id="password-error" className="message-error">
                  {this.state.validationError["password"]}
                </div>
              </label>
            </div>
          </div>
          <div id="personal-information">
            <div id="date-picker">
              <label>
                Date of birth:
                <DatePicker
                  value={new Date(this.state.registerInfo["birthday"])}
                  date={new Date()}
                  onChange={(date) => {
                    let registerInfo = this.state.registerInfo;
                    registerInfo["birthday"] = date.toISOString();
                    this.setState({ registerInfo });
                  }}
                />
              </label>
            </div>
            <div id="profile-picture">
              <label>
                Upload profile picture:
                <input type="file" onChange={this.pictureHandler.bind(this)} />
              </label>
            </div>
          </div>
        </div>
        <div id="register-button">
          <button type="submit" id="register-btn">
            Register
          </button>
        </div>
      </form>
    );
  }
}

export default SignUpScreen;