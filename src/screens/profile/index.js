import React, { Component } from 'react'
import 'src/style/nav.scss'

const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'
const thisYear = new Date().getFullYear()
function getYear(isoStr) {
  return new Date(isoStr).getFullYear()
}

class Profile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let user = this.props.user
    console.log(user)
    return (
      <div id="nav-profile">
        <div id="profile-avatar" 
          style={{backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')`}}
        ></div>
        <div id="profile-name">{user.info.name}</div>
        <div id="profile-sub-info">{thisYear - getYear(user.info.birthdate)} - {user.info.gender}</div>
        <div id="profile-options">
          <div className="profile-opt" id="opt-detail-info">Edit Profile</div>
          <div className="profile-opt" id="opt-change-password">Change Password</div>
          <div className="profile-opt" id="opt-sign-out">Sign out</div>
        </div>
      </div>
    )
  }
}

export default Profile