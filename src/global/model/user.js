class UserInfo {
  constructor(info) {
    this.name = info.name
    this.birthdate = info.birthdate
    this.gender = info.gender,
    this.interest = info.interest
    this.desc = info.desc,
    this.imgUrl = info.imgUrl
  }
}

class User {
  constructor(item) {
    this._id = item._id
    this.email = item.email
    this.info = new UserInfo(item.info)
    this.match = item.match
    this.likedBy = item.likedBy
    this.like = item.like
    this.unlike = item.unlike
    this.accessToken = item.accessToken
  }
}
export default User