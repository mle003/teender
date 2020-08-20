import { Container } from "unstated";
import {User} from "../model/user";
let INITIAL_STATE = {
  user: null,
}
class UserContainer extends Container {
  state = INITIAL_STATE
  saveUserData = userData => {
    if (!!userData)
      this.setState({ user: new User(userData) })
  };
  resetData = () => {
    this.setState(INITIAL_STATE)
  };
  saveUpdatedProfile = userData => {
    if (!!userData) {
      let thisUser = {...this.state.user}
      thisUser.info = userData.info,
      thisUser.email = userData.email
      this.setState({ user: thisUser })
    }
  };
}

export default UserContainer;
