import { Container } from "unstated";
import { concatAndFilterDuplicateById } from "../utils";

let INITIAL_STATE = {
  list: null, // list of chat, display latest message => socket.io -> change latest mess
  selectedChatInfo: null, // _id and info of user
  messages: null // messages of a channel chat => socket.io -> unshift to arr
}


class ChatContainer extends Container {
  state = INITIAL_STATE
  resetData = () => {
    this.setState(INITIAL_STATE)
  }
  // for socket.io
  saveNewMess = (newMess, chatId) => {
    let list = this.state.list
    let messages = this.state.messages

    // update list
    let newList = list.map(item => {
      if (item._id == chatId) {
        if(item.messages.length) {
          // remove duplicate when catch socket.io
          if(item.messages[0]._id != newMess._id) 
            item.messages.unshift(newMess) // insert at beginning of array
        } else {
          item.messages.unshift(newMess) // insert at beginning of array
        }
      }
      return item
    })
    
    // if chat is selected
    if (this.state.selectedChatInfo._id == chatId) {
      messages.unshift(newMess)
    }

    this.setState({list: newList, messages: messages})
  }
  
  selectChatChannel(chatId) {
    // get list mess
    let messages = []
    let chatInfo = null
    let list = this.state.list
    
    for (let item of list) {
      if (item._id == chatId) {
        // chat info model
        chatInfo = {
          user: item.users[0],
          _id: item._id,
          createdAt: item.createdAt
        }
        messages = item.messages
        break;
      }
    }
    // get list mess
    this.setState({selectedChatInfo: chatInfo, messages: messages})
  }
  saveChatList(list) {
    this.setState({list: list})    
  }
  loadMoreOldChatList(olderList) {
    let list = [...this.state.list, ...olderList]
    this.setState({list: list})
  }
  saveMessages(messages) {
    this.setState({messages: messages})
  }
  loadMoreOldMessages(olderMessages) {
    let messages = [...this.state.messages, ...olderMessages]
    this.setState({messages: messages})
  }
}

export default ChatContainer;
