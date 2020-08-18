import React, { Component } from 'react'
import 'src/style/resetPassword.scss'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPw: '',
      newPw: '',
      confirmPw: '',
      errMess: ''
    }
  }

  handleInput(e, field) {
    this.setState({
      [field]: e.target.value
    })

    let { oldPw, newPw, confirmPw } = this.state

    if (field == "confirmPw" && e.target.value != newPw)
      this.setState({errMess: "Password is not yet matched"})
    else if (field == "newPw" && confirmPw.length && e.target.value != confirmPw)
      this.setState({errMess: "Password is not yet matched"})
    else
      this.setState({errMess: ""})    
  }

  submitChange() {
    try {
      let {oldPw, newPw, confirmPw } = this.state

      if (!oldPw.length || !newPw.length || !confirmPw.length)
        throw new Error("Please fill all fields! 🙆‍♀️")

      if (newPw != confirmPw)
        throw new Error("Password is not yet matched")

    } catch (err) {
      this.setState({errMess: err.message})    
    }

  }

  render() {
    return (
      <form id="nav-reset-password">
        <div className="nav-pw-title">Reset Password</div>
        <label>
          <div className="input-label">Old password:</div>
          <input type="password" onChange={e=>this.handleInput(e,"oldPw")}/>
        </label>
        <label>
          <div className="input-label">New password:</div>
          <input type="password" onChange={e=>this.handleInput(e,"newPw")}/>
        </label>
        <label>
          <div className="input-label">Confirm new password:</div>
          <input type="password" onChange={e=>this.handleInput(e,"confirmPw")}/>
        </label>
        <button className="nav-pw-button">Confirm change</button>
        <div className="err-message">{this.state.errMess}</div>
      </form>
    )
  }
}

export default ResetPassword