import { Container } from "unstated";
import {MAIN_SCREEN} from "../global/utils"
import { User } from "src/global/model/user";

class MyContainer extends Container {
  state = {
    user: null,
    mainScreen: MAIN_SCREEN.DECK,
    selectedUser: null // userData, which includes 'info' and '_id' fields 
  };
  saveUserData = userData => {
    if (!!userData)
      this.setState({ user: new User(userData) })
  };
  resetData = () => {
    this.setState({ user: null })
  };
  saveUpdatedProfile = userData => {
    if (!!userData) {
      let thisUser = {...this.state.user}
      thisUser.info = userData.info,
      thisUser.email = userData.email
      this.setState({ user: thisUser })
    }
  };
  selectMainScreen(screenName) {
    this.setState({ mainScreen: screenName })
  }
  selectUser(userData) {
    this.setState({ selectedUser: userData, mainScreen: MAIN_SCREEN.CHAT })
  }
}

export default MyContainer;
