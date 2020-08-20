import React, { Component } from 'react'
import {ReceivedMess, SentMess} from './bubble'
import 'src/style/chat.scss'
import { userAvatarUrl, MAIN_SCREEN } from '../../../global/utils'

class ChatBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {selectedUser, container} = this.props
    return (
      <div id="chat-box">
        <div id="chat-header">
          <div id="chat-header-avatar-container">
            <div id="chat-header-avatar" style={{backgroundImage: `url('${selectedUser.info.imgUrl || userAvatarUrl}')`}}></div>
          </div>
          <div id="chat-header-text">
            <div id="chat-header-name">{selectedUser.info.name}</div>
            <div id="chat-header-info">
              You matched with {selectedUser.info.name} on
              {" " + new Date(selectedUser.createdAt).toLocaleDateString("vi-VN") || ""}
            </div>
          </div>
          <button 
            onClick={()=>{container.selectDeckScreen()}}
            id="chat-close-button" 
            type="button"><ion-icon id="chat-close-icon" name="close"></ion-icon>
          </button>
        </div>
        <div id="chat-body">
          {ReceivedMess()}
          {SentMess()}
          {ReceivedMess()}
          {ReceivedMess()}
          {ReceivedMess()}
          {SentMess()}
          {ReceivedMess()}
          {SentMess()}
        </div>
        <div id="chat-footer">
          <form id="chat-form">
            <input id="chat-input" placeholder="Type something..."/>
            <button id="send-button" type="submit"><ion-icon name="send" id="send-icon"></ion-icon></button>
          </form>
        </div>
      </div>
    )
  }
}

export default ChatBox