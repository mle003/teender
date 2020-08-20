import { Container } from "unstated";
import {MAIN_SCREEN} from "src/global/utils"
let INITIAL_STATE = {
  mainScreen: MAIN_SCREEN.DECK,
  selectedUser: null, // userData, which includes 'info' and '_id' fields 
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
  selectDeckScreen() {
    this.setState({ mainScreen: MAIN_SCREEN.DECK })
  }
  selectChatScreen(userData) {
    this.setState({ selectedUser: userData, mainScreen: MAIN_SCREEN.CHAT })
  }
}

export default HomeScreenContainer;
