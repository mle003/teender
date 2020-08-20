import { Container } from "unstated";
import {User} from "./model/user";

class MyContainer extends Container {
  state = {
    user: null,
  };
  saveUserData = userData => {
    if (!!userData)
      this.setState({ user: new User(userData) })
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

export default MyContainer;
