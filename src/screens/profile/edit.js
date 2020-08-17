import React, { Component } from 'react'
import 'src/style/nav.scss'
import 'src/style/editProfile.scss'

import { Subscribe, Container } from 'unstated'
import MyContainer from '../../global/state'
import DatePicker from 'react-date-picker'

const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'

const MALE = "male"
const FEMALE = "female"

class EditProfile extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      info: {
        email: null,
        name: null,
        gender: null,
        interest: null,
        birthdate: null,
        imgUrl: null,
        desc: null
      }
    }
  }
  handleInput(e, field) {
    let info = {...this.state.info}
    let value = e.target.value
    info[field] = value
    this.setState({ info })
  }

  
  render() {
    return (<Subscribe to={[MyContainer]}>
      {container => {
        let user = container.state.user
        let { info } = this.state
        return (
          <div id="nav-profile">
            <label id="profile-avatar"
              style={{ backgroundImage: `url('${info.imgUrl || user.info.imgUrl || userAvatarUrl}')` }}
            ><input type="file" id="avatar-input"/></label>
            <div id="profile-name-email">
              <label>
                <div className="input-label">Email:</div>
                <input 
                name="email" 
                type="email" value={info.email != null ? info.email : user.email} 
                onChange={e=>this.handleInput(e, "email")}/>
              </label>
              <label>
                <div className="input-label">Name:</div>
                <input 
                name="name"
                value={info.name != null ? info.name : user.info.name} 
                onChange={e=>this.handleInput(e, "name")}/>
              </label>
            </div>
            {this.genderRow(info, user)}
            <label id="date-picker-input-label">
              <div className="input-label">Date of Birth:</div>
              <DatePicker
                id="date-picker-input"
                showLeadingZeros={true}
                format="dd-MM-y"
                value={new Date(info.birthdate != null ? info.birthdate : user.info.birthdate)}
                date={new Date()}
                onChange={(date) => {
                  console.log(date)
                  info.birthdate = date.toISOString();
                  this.setState({ info });
                }}
              />
            </label>
            <label id="desc-textarea-container">
              <div className="input-label">Description:</div>
              <textarea 
                id="desc-textarea"
                rows="4" id="desc-input" maxLength="200"
                name="desc" placeholder="Describe yourself..." 
                value={info.desc != null ? info.desc : user.info.desc}
                onChange={e=>this.handleInput(e, "desc")}/>
            </label>
            <div id="profile-btn-group">
              <button id="profile-submit">Submit</button>
              <button id="profile-reset">Reset</button>
            </div>
          </div>
        )
      }}
    </Subscribe>)
  }

  genderRow(info, user) {
    return (
      <div id="gender-row">
        <div className="gender">
          <label>
            <div className="input-label">Gender:</div>
            <div className="gender-options">
              <span>
                <label className="gender-option"><span>Male</span>
                  <input type="radio" name="gender" value={MALE}
                    checked={info.gender === null ? user.info.gender === MALE : info.gender === MALE}
                    onChange={e=>this.handleInput(e, "gender")}
                  />
                </label>
              </span>
              <span>
                <label className="gender-option"><span>Female</span>
                  <input type="radio" name="gender" value={FEMALE}
                    checked={info.gender === null ? user.info.gender === FEMALE : info.gender === FEMALE}
                    onChange={e=>this.handleInput(e, "gender")}
                  />
                </label>
              </span>
            </div>
          </label>
        </div>
        <div className="gender">
          <label>
            <div className="input-label">Interested in:</div>
            <div className="gender-options">
              <span>
                <label className="gender-option"><span>Male</span>
                  <input type="radio" name="interest" value={MALE}
                    checked={info.interest === null ? user.info.interest === MALE : info.interest === MALE}
                    onChange={e=>this.handleInput(e, "interest")}
                  />
                </label>
              </span>
              <span>
                <label className="gender-option"><span>Female</span>
                  <input type="radio" name="interest" value={FEMALE}
                    checked={info.interest === null ? user.info.interest === FEMALE : info.interest === FEMALE}
                    onChange={e=>this.handleInput(e, "interest")}
                  />
                </label>
              </span>
            </div>
          </label>
        </div>
      </div>
    )
  }
}

export default EditProfile