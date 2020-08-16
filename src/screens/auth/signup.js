import React, { Component, useState } from "react";
import logo from "../../assets/logo.png";
import DatePicker from "react-date-picker";
import 'src/style/signup.scss'
import Axios from "axios";
import ROUTES from "../../global/routes";
import { Link } from "react-router-dom";
import MyRequest from "../../global/api/request";
import OtherRequest from "../../global/api/external";

const imageStatus = {
  DONE: 'done uploading!',
  UPLOADING: 'uploading',
  FAILED: 'failed uploading :(',
  EMPTY: ''
}

class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      registerInfo: { birthdate: new Date().toISOString(), gender: "male", interest: "male" },
      validationError: {},
      formError: '',
      imageStatus: imageStatus.EMPTY
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

  pictureHandler(event) {
    try {
      this.setState({
        imageStatus: imageStatus.UPLOADING
      })
      var file = event.target.files[0];
      let aMb = 1048576

      if (!file) {
        this.setState({
          imageStatus: imageStatus.EMPTY
        })
      }

      if (file.size> 8 * aMb)
        throw new Error('The image size is too big! Please select another one')

      var reader = new FileReader();
      reader.readAsDataURL(file)

      reader.onloadend = async () => {
        try{
          let base64Code = reader.result.split(',')[1]
          let image = await OtherRequest.uploadImage(base64Code)
          let registerInfo = this.state.registerInfo;
          registerInfo['imgUrl'] = image.link;
          this.setState({ 
            registerInfo,
            imageStatus: imageStatus.DONE
          });
        } catch(err) {
          this.setState({
            imageStatus: imageStatus.FAILED
          })
          throw err
        }
        
      }
    } catch(err) {
      this.setState({
        imageStatus: err.message || imageStatus.FAILED
      })
    }
  }

  async submitHandler(e) { // email, pass + info(name, gender, interest, birthdate, desc, imgUrl)
    e.preventDefault();
    try {
      if (!this.handleValidation())
        throw new Error('The data provided is not validated')
      let registerInfo = {...this.state.registerInfo};
      registerInfo.name = registerInfo.firstName + " " + registerInfo.lastName;
      delete registerInfo.firstName
      delete registerInfo.lastName

      console.log(registerInfo);
      let newUser = await MyRequest.signUp(registerInfo)
      localStorage.setItem("token", newUser.accessToken);
      this.props.history.push({
        pathname: ROUTES.HOME,
        state: { user: newUser }
      });
    } catch(err) {
      let errMess = err.message
      if (err.message.includes('duplicate key')) {
        errMess = 'An account with this data has already be created. Please sign in 💁🏻'
      }
      this.setState({formError: errMess})
    }
  }



  render() {
    return (
      <form id="signup-screen" onSubmit={this.submitHandler.bind(this)}>
        <div id="signup-title">Create account for<span>teender</span></div>
        <div id="signup-form">
          <div id="user-name">
            <div id="first-name" className="name">
              <label>
                <div className="input-label">First Name:</div>
                <input
                  className="signup-input"
                  type="text"
                  onChange={this.handleChange.bind(this, "firstName")}
                />
                <div id="firstname-error" className="message-error">
                  {this.state.validationError["firstName"]}
                </div>
              </label>
            </div>
            <div id="last-name" className="name">
              <label>
                <div className="input-label">Last Name:</div>
                <input
                  className="signup-input"
                  type="text"
                  onChange={this.handleChange.bind(this, "lastName")}
                />
                <div id="lastname-error" className="message-error">
                  {this.state.validationError["lastName"]}
                </div>
              </label>
            </div>
          </div>
          <div id="gender-row">
            <div className="gender">
              <label>
                <div className="input-label">Gender:</div>
                <div className="gender-options">
                  <div>
                    <label className="gender-option">Male
                      <input type="radio" name="gender" value="male"
                        checked={this.state.registerInfo.gender === "male"}
                        onChange={this.handleChange.bind(this, "gender")}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="gender-option">Female
                      <input type="radio" name="gender" value="female"
                        checked={this.state.registerInfo.gender === "female"}
                        onChange={this.handleChange.bind(this, "gender")}
                      />
                    </label>
                  </div>
                </div>
              </label>
            </div>
            <div className="gender">
              <label>
                <div className="input-label">Interested in:</div>
                <div className="gender-options">
                  <div>
                    <label className="gender-option">Male
                      <input type="radio" name="interest" value="male"
                        checked={this.state.registerInfo.interest === "male"}
                        onChange={this.handleChange.bind(this, "interest")}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="gender-option">Female
                      <input type="radio" name="interest" value="female"
                        checked={this.state.registerInfo.interest === "female"}
                        onChange={this.handleChange.bind(this, "interest")}
                      />
                    </label>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div id="account">
            <div id="email" className="account-info">
              <label>
                <div className="input-label">Email:</div>
                <input
                  className="signup-input"
                  type="email"
                  onChange={this.handleChange.bind(this, "email")}
                />
                <div id="email-error" className="message-error">
                  {this.state.validationError["email"]}
                </div>
              </label>
            </div>
            <div id="password" className="account-info">
              <label>
                <div className="input-label">Password:</div>
                <input
                  className="signup-input"
                  type="password"
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
                <div className="input-label">Date of Birth:</div>
                <DatePicker
                  id="signup-date-picker"
                  showLeadingZeros={true}
                  format="dd-MM-y"
                  value={new Date(this.state.registerInfo["birthdate"])}
                  date={new Date()}
                  onChange={(date) => {
                    let registerInfo = this.state.registerInfo;
                    registerInfo["birthdate"] = date.toISOString();
                    this.setState({ registerInfo });
                  }}
                />
              </label>
            </div>
            <div id="profile-picture">
              <label>
                <div className="input-label">Upload profile picture:</div>
                <input
                  style={{ marginTop: 10, cursor: 'pointer', height: 30, paddingLeft: 0, borderRadius: 0}}
                  type="file" accept="image/x-png,image/gif,image/jpeg"
                  onChange={this.pictureHandler.bind(this)} />
                <div className="message-error" style={{color: 'black'}}>
                  {this.state.imageStatus}
                </div>
              </label>
            </div>
          </div>
        </div>
        <div id="register-button">
          <div id="sign-up-error">{this.state.formError}</div>
          <button 
            type="submit" id="register-btn" 
            disabled={this.state.imageStatus == imageStatus.UPLOADING}>
            Register
          </button>
        </div>
        <div className="to-sign-in-container">
          <span className="ask-text">Or </span>
          <span id="to-sign-in">
            <Link to={ROUTES.SIGN_IN}>Sign in</Link>
          </span>
          <span className="ask-text"> if you already have an account</span>
        </div>
      </form>
    );
  }
}

export default SignUpScreen;