import React, { Component } from 'react'
import {ReceivedMess, SentMess} from './bubble'
import 'src/style/chat.scss'

class ChatBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="chat-box">
        <div id="chat-header">
          <div id="chat-header-avatar-container">
            <div id="chat-header-avatar" style={{backgroundImage: "url('https://www.shorturl.at/img/shorturl-square.png')"}}></div>
          </div>
          <div id="chat-header-text">
            <div id="chat-header-name">Hello Hello</div>
            <div id="chat-header-info">You match with Hello on 12/12/2012</div>
          </div>
          <button id="chat-close-button" type="button"><ion-icon id="chat-close-icon" name="close"></ion-icon></button>
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