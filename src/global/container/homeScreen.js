import { Container } from "unstated";
import {MAIN_SCREEN, TITLES, NAVS} from "../../global/utils"
let INITIAL_STATE = {
  mainScreen: MAIN_SCREEN.DECK,
  nav: NAVS.MAIN,
  navTitle: TITLES.MATCH,
  // selectedUser: null, 
  // userData, which includes 'info' and '_id' fields 
  cards: [] // when navigating between screen => load cards
}
class HomeScreenContainer extends Container {
  state = INITIAL_STATE
  resetData = () => {
    this.setState(INITIAL_STATE)
  }
  saveCards = (cardsData) => {
    this.setState({cards: cardsData})
  }

  // select main screen -------------------
  selectDeckScreen() {
    this.setState({ mainScreen: MAIN_SCREEN.DECK })
  }
  selectChatScreen() {
    this.setState({ mainScreen: MAIN_SCREEN.CHAT })
  }

  // select nav-titles -----------
  selectNavTitlesMatch() {
    this.setState({ navTitle: TITLES.MATCH })
  }
  selectNavTitlesChat() {
    this.setState({ navTitle: TITLES.CHAT })
  }

  // select nav ----------
  selectNavMain() {
    this.setState({ nav: NAVS.MAIN })
  }
  selectNavProfile() {
    this.setState({ nav: NAVS.PROFILE })
  }
  selectNavEditProfile() {
    this.setState({ nav: NAVS.EDIT_PROFILE })
  }
  selectNavResetPassword() {
    this.setState({ nav: NAVS.RESET_PASSWORD })
  }
}

export default HomeScreenContainer;
