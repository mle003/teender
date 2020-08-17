import React, { Component } from 'react'
import 'src/style/nav.scss'
import 'src/style/signup.scss'

import { Subscribe } from 'unstated'
import MyContainer from '../../global/state'
import DatePicker from 'react-date-picker'

const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'
const thisYear = new Date().getFullYear()
function getYear(isoStr) {
  return new Date(isoStr).getFullYear()
}

class EditProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (<Subscribe to={[MyContainer]}>
      {container => {
        let user = container.state.user
        console.log(user)
        return (
          <div id="nav-profile">
            <div id="profile-avatar"
              style={{ backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')` }}
            ><input type="file" /></div>
            <input name="name" placeholder="Name" />
            <input name="email" placeholder="Email" type="email" />
            {this.genderRow()}
            <label>
              <div className="input-label">Date of Birth:</div>
              <DatePicker
                id="signup-date-picker"
                showLeadingZeros={true}
                format="dd-MM-y"
                // value={new Date(this.state.registerInfo["birthdate"])}
                date={new Date()}
                // onChange={(date) => {
                //   let registerInfo = this.state.registerInfo;
                //   registerInfo["birthdate"] = date.toISOString();
                //   this.setState({ registerInfo });
                // }}
              />
            </label>
            <input name="desc" placeholder="description"/>

            <div id="profile-name">{user.info.name}</div>
            <div id="profile-sub-info">{thisYear - getYear(user.info.birthdate)} - {user.info.gender}</div>

          </div>
        )
      }}
    </Subscribe>)
  }

  genderRow() {
    return (
      <div id="gender-row">
        <div className="gender">
          <label>
            <div className="input-label">Gender:</div>
            <div className="gender-options">
              <div>
                <label className="gender-option">Male
                      <input type="radio" name="gender" value="male"
                  // checked={this.state.registerInfo.gender === "male"}
                  // onChange={this.handleChange.bind(this, "gender")}
                  />
                </label>
              </div>
              <div>
                <label className="gender-option">Female
                      <input type="radio" name="gender" value="female"
                  // checked={this.state.registerInfo.gender === "female"}
                  // onChange={this.handleChange.bind(this, "gender")}
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
                  // checked={this.state.registerInfo.interest === "male"}
                  // onChange={this.handleChange.bind(this, "interest")}
                  />
                </label>
              </div>
              <div>
                <label className="gender-option">Female
                      <input type="radio" name="interest" value="female"
                  // checked={this.state.registerInfo.interest === "female"}
                  // onChange={this.handleChange.bind(this, "interest")}
                  />
                </label>
              </div>
            </div>
          </label>
        </div>
      </div>
    )
  }
}

export default EditProfile