import React, { Component } from 'react'
import 'src/style/resetPassword.scss'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="nav-reset-password">
        <div className="nav-pw-title">Reset Password</div>
        <label>
          <div className="input-label">Old password:</div>
          <input type="password"/>
        </label>
        <label>
          <div className="input-label">New password:</div>
          <input type="password"/>
        </label>
        <label>
          <div className="input-label">Confirm new password:</div>
          <input type="password"/>
        </label>
        <button className="nav-pw-button">Confirm change</button>
        <div className="err-message">Wrong password!</div>
      </div>
    )
  }
}

export default ResetPassword