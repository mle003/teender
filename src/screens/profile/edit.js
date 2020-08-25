import React, { Component } from 'react'
import 'src/style/nav.scss'
import 'src/style/editProfile.scss'

import { Subscribe, Container } from 'unstated'
import DatePicker from 'react-date-picker'
import SettingRequest from '../../global/api/setting'
import CircularProgress from '@material-ui/core/CircularProgress';
import { userAvatarUrl } from '../../global/utils'
import UserContainer from '../../global/container/user'

const MALE = "male"
const FEMALE = "female"
const IMAGE_STATUS = {
  DONE: 'done uploading!',
  UPLOADING: 'uploading',
  FAILED: 'failed uploading :(',
  EMPTY: ''
}

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
      },
      errMess: '',
      successMess: '',
      imageStatus: null,
      loadingUpdateProfile: false,
      newData: null
    }
  }
  handleInput(e, field) {
    let info = {...this.state.info}
    let value = e.target.value
    info[field] = value
    this.setState({ info: info, errMess: '' })
  }

  pictureHandler(event) {
    try {
      this.setState({
        imageStatus: IMAGE_STATUS.UPLOADING
      })
      var file = event.target.files[0];
      let aMb = 1048576

      if (!file) 
        throw new Error(IMAGE_STATUS.EMPTY)

      if (file.size> 8 * aMb)
        throw new Error('The image size is too big! Please select another one')

      var reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = () => {
          let info = this.state.info
          info.imgUrl = render.result
          this.setState({ 
            info: info,
            imageStatus: IMAGE_STATUS.DONE
          });        
      }
    } catch(err) {
      this.setState({
        imageStatus: err.message || IMAGE_STATUS.FAILED
      })
    }
  }

  async submitHandler(e) {
    e.preventDefault()
    try {
      this.setState({errMess: '', successMess: '', loadingUpdateProfile: true})
      let missingData = []
      let info = this.state.info
      for (let field in info) {
        if (info[field] != null && info[field].length == 0 && !['desc', 'imgUrl'].includes(field)) {
          missingData.push(field)
        }
      }
      if (missingData.length) {
        let missingFields = missingData.join(', ')
        throw new Error('Missing field(s): ' + missingFields)
      } else {
        let newData = await SettingRequest.updateProfile(info)
        this.setState({
          newData: newData, 
          errMess: '', 
          successMess: 'Update profile successfully! ✌️', 
          loadingUpdateProfile: false})
      }
    } catch(err) {
      this.setState({
        errMess: err.message, 
        successMess: '', 
        loadingUpdateProfile: false})
    }
  }

  componentDidUpdate() {
    let { info, newData } = this.state
    if (!!newData) {
      for (let field in info) {
        info[field] = null
      }
      this.setState({newData: null, info: info})
    }
  }

  render() {
    return (<Subscribe to={[UserContainer]}>
      {container => {
        let user = container.state.user
        let { info, newData } = this.state
        if (!!newData) {
          container.saveUpdatedProfile(newData)
        }
        // console.log('newUser', this.state.newData)
        return (
          <div id="nav-profile">
            <label id="profile-avatar"
              style={{ backgroundImage: `url('${info.imgUrl || user.info.imgUrl || userAvatarUrl}')` }}>
              <div id="profile-avatar-filter">
                <input type="file" id="avatar-input"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={this.pictureHandler.bind(this)}/>
                <ion-icon name="camera"></ion-icon>
              </div>
            </label>
            <div id="profile-name-email">
              <label>
                <div className="input-label">Email:</div>
                <input 
                name="email" maxLength="50"
                type="email" value={info.email != null ? info.email : user.email} 
                onChange={e=>this.handleInput(e, "email")}/>
              </label>
              <label>
                <div className="input-label">Name:</div>
                <input 
                name="name" maxLength="50"
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
                maxDate={new Date()}
                minDate={new Date('01-01-1900')}
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
            <div style={{display: 'flex', marginBottom: 10}}>
              <div className="err-message">{this.state.errMess}</div>
              <div className="success-message">{this.state.successMess}</div>
            </div>
            <div id="profile-btn-group">
              <button id="profile-submit" 
                type="button" 
                disabled={this.state.loadingUpdateProfile}
                onClick={this.submitHandler.bind(this)}>
                {this.state.loadingUpdateProfile ? <CircularProgress size={15} color="white"/> : "Submit"}
              </button>
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