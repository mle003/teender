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
      sendingOnload: false
    }
  }

  async handleSendMessage(e) {
    e.preventDefault()
    try {
      this.setState({sendingOnload: true})
      let chatId = this.props.chatCon.state.selectedChatInfo._id
      let content = this.state.contentMessage
      let type = this.state.type

      let mess = {
        content,
        type
      }
      let newMess = await ChatRequest.sendMessage(mess, chatId)
      await this.props.chatCon.saveNewMess(newMess, chatId)
      this.setState({sendingOnload: false})
    } catch(err) {
      console.log(err)
      this.setState({sendingOnload: false})
    } 
  }

  render() {
    let selectedUser = this.props.chatCon.state.selectedChatInfo.user
    let createdAt = this.props.chatCon.state.selectedChatInfo.createdAt
    return (
    <Subscribe to={[ChatContainer]}>
      {container => <div id="chat-box">
        <div id="chat-header">
          <div id="chat-header-avatar-container">
            <div id="chat-header-avatar" style={{backgroundImage: `url('${selectedUser.info.imgUrl || userAvatarUrl}')`}}></div>
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
          { container.state.messages.length
            ? container.state.messages
              .map(item => item.owner == selectedUser._id ? ReceivedMess(item) : SentMess(item))
            : <div>Send your first message!</div>
          }
        </div>
        <div id="chat-footer">
          <form id="chat-form" onSubmit={e=>this.handleSendMessage(e)}>
            <input id="chat-input" 
              value={this.state.contentMessage} 
              onChange={e=>this.setState({contentMessage: e.target.value})} 
              placeholder="Type something..."/>
            <button id="send-button" disabled={this.state.sendingOnload}><ion-icon name="send" id="send-icon"></ion-icon></button>
          </form>
        </div>
      </div>}
    </Subscribe>
    )
  }
}

export default ChatBox