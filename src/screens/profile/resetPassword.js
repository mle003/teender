import React, { Component } from 'react'
import 'src/style/resetPassword.scss'
import SettingRequest from '../../global/api/setting'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPw: '',
      newPw: '',
      confirmPw: '',
      errMess: '',
      successMess: '',
    }
  }

  handleInput(e, field) {
    this.setState({
      [field]: e.target.value
    })

    let { oldPw, newPw, confirmPw } = this.state

    if (field == "confirmPw" && e.target.value != newPw)
      this.setState({errMess: "Password is not yet matched", successMess: ""})
    else if (field == "newPw" && confirmPw.length && e.target.value != confirmPw)
      this.setState({errMess: "Password is not yet matched", successMess: ""})
    else {
      this.setState({errMess: "", successMess: ""})
    }
  }

  async submitChange() {
    try {
      let {oldPw, newPw, confirmPw } = this.state

      if (!oldPw.length || !newPw.length || !confirmPw.length)
        throw new Error("Please fill all fields! 🙆‍♀️")

      if (newPw != confirmPw)
        throw new Error("Password is not yet matched")
    
      let successMess = await SettingRequest.resetPassword(oldPw, newPw)
      this.setState({
        errMess: "", 
        successMess: successMess,
        oldPw: "",
        newPw: "",
        confirmPw: ""
      })  

    } catch (err) {
      this.setState({errMess: err.message, successMess: ""})    
    }

  }

  render() {
    let {oldPw, newPw, confirmPw} = this.state
    return (
      <form id="nav-reset-password">
        <div className="nav-pw-title">Reset Password</div>
        <label>
          <div className="input-label">Old password:</div>
          <input type="password" value={oldPw} onChange={e=>this.handleInput(e,"oldPw")} autoComplete="on"/>
        </label>
        <label>
          <div className="input-label">New password:</div>
          <input type="password" value={newPw} onChange={e=>this.handleInput(e,"newPw")} autoComplete="on"/>
        </label>
        <label>
          <div className="input-label">Confirm new password:</div>
          <input type="password" value={confirmPw} onChange={e=>this.handleInput(e,"confirmPw")} autoComplete="on"/>
        </label>
        <button className="nav-pw-button" type="button" onClick={()=>this.submitChange()}>Confirm change</button>
        <div className="err-message">{this.state.errMess}</div>
        <div className="success-message">{this.state.successMess}</div>
      </form>
    )
  }
}

export default ResetPassword