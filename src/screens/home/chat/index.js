import React, { Component } from 'react'
import {ReceivedMess, SentMess} from './bubble'
import 'src/style/chat.scss'
import { userAvatarUrl, MAIN_SCREEN } from '../../../global/utils'
import ChatRequest from '../../../global/api/chat'
import { Subscribe } from 'unstated'
import ChatContainer from '../../../global/container/chat'

class ChatBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentMessage: '',
      type: 'text',
      sendingOnload: false,
      errorSendingMess: '',
      loadedAllMess: false,
      // currentChatId: this.props.chatCon.state.selectedChatInfo_id
    }
    this.chatListRef = React.createRef()
    this.socket = this.props.socket
  }


  scrollToBottom = () => {
    this.chatListRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start'  });
  }

  componentDidMount() {
    let chatCon = this.props.chatCon
    this.setState({
      loadedAllMess: false,
    })

    this.socket.on('receive-message', async function(newMess, chatId, userId) {
      console.log(userId + ' is my Id')
      await chatCon.saveNewMess(newMess, chatId)
    })
  }

  async loadMoreOldMessages() {
    await this.props.chatCon.increaseMessagePage()
    let page = this.props.chatCon.state.messagePage
    let chatId = this.props.chatCon.state.selectedChatInfo._id

    let oldMessages = await ChatRequest.getMessage(page, chatId)
    oldMessages = oldMessages.messages
    
    if (oldMessages.length) {
      this.props.chatCon.loadMoreOldMessages(oldMessages)
    } else {
      this.setState({loadedAllMess: true})
    }
  }

  async handleSendMessage(e) {
    e.preventDefault()
    try {
      this.setState({sendingOnload: true})
      let chatId = this.props.chatCon.state.selectedChatInfo._id
      let matchId = this.props.chatCon.state.selectedChatInfo.user._id
      let content = this.state.contentMessage
      let type = this.state.type
      if (!content.trim()) {
        throw new Error('')
      }
      let mess = {
        content,
        type
      }
      // api here
      let newMessData = await ChatRequest.sendMessage(mess, chatId)
      this.socket.emit('send-message', newMessData.messages[0], chatId, matchId)
      this.props.chatCon.saveNewMess(newMessData.messages[0], chatId)

      this.setState({sendingOnload: false, contentMessage: ''})
      this.scrollToBottom()
    } catch(err) {
      console.log(err)
      let sendingOnload = false
      let errorSendingMess = err.message
      let contentMess = errorSendingMess.length ? this.state.contentMessage : ''
      this.setState({sendingOnload, errorSendingMess, contentMess})
    } 
  }

  render() {
    let selectedInfo = this.props.chatCon.state.selectedChatInfo
    let selectedUser = selectedInfo.user
    let list = this.props.chatCon.state.list

    let isOnline = false
    for (let item of list) {
      if (item._id == selectedInfo._id && item.online)
        isOnline = true; break 
    }
    let createdAt = selectedInfo.createdAt
    return (
    <Subscribe to={[ChatContainer]}>
      {container => <div id="chat-box">
        <div id="chat-header">
          <div id="chat-header-avatar-container">
            <div id="chat-header-avatar" style={{backgroundImage: `url('${selectedUser.info.imgUrl || userAvatarUrl}')`}}>
              {isOnline ? <div className="chat-header-online-dot"></div> : <div></div>}
            </div>
          </div>
          <div id="chat-header-text">
            <div id="chat-header-name">{selectedUser.info.name}</div>
            <div id="chat-header-info">
              You matched with {selectedUser.info.name} on
              {" " + new Date(createdAt).toLocaleDateString("vi-VN") || ""}
            </div>
          </div>
          <button 
            onClick={()=>{this.props.homeCon.selectDeckScreen()}}
            id="chat-close-button" 
            type="button"><ion-icon id="chat-close-icon" name="close"></ion-icon>
          </button>
        </div>
        <div id="chat-body">
          <div ref={this.chatListRef}></div>
          {container.state.messages.length
            ? container.state.messages
              .map(item => item.owner == selectedUser._id ? ReceivedMess(item) : SentMess(item))
            : <div id="chat-body-empty">Let's say hello to each other! 👋</div>
          }
          {container.state.messages.length < 20
            ? <div></div>
            : <div id="load-more-chat" 
            style={{display: this.state.loadedAllMess ? 'none' : 'block'}}
            onClick={()=>this.loadMoreOldMessages()}>
              Load older messages...
          </div>
          }
        </div>
        <div id="chat-footer">
          <form id="chat-form" onSubmit={e=>this.handleSendMessage(e)}>
            <div className="chat-input-container">
              <input id="chat-input" 
                value={this.state.contentMessage} 
                onChange={e=>this.setState({contentMessage: e.target.value, errorSendingMess: ''})} 
                placeholder="Type something..."/>
              <div className="err-message">{this.state.errorSendingMess}</div>
            </div>      
            <button id="send-button" disabled={this.state.sendingOnload}><ion-icon name="send" id="send-icon"></ion-icon></button>
          </form>
        </div>
      </div>}
    </Subscribe>
    )
  }
}

export default ChatBox