import { Container } from "unstated";
import User from "./model/user";

class MyContainer extends Container {
  state = {
    user: null,
  };
  saveUserData = async userData => {
    await this.setState({ user: new User(userData) })
  };
}

export default MyContainer;
