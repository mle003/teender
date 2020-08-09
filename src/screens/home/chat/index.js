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
          <div id="chat-header-avatar" style={{backgroundImage: `url('https://www.shorturl.at/img/shorturl-square.png')`}}></div>
          <div id="chat-header-text">
            <div id="chat-header-name">Hello Hello</div>
            <div id="chat-header-info">You match with Hello on 12/12/2012</div>
          </div>
        </div>
        <div id="chat-body">
          {ReceivedMess()}
          {SentMess()}
          {SentMess()}
        </div>
        <div id="chat-input-container">
          <input id="chat-input"/>
        </div>
      </div>
    )
  }
}

export default ChatBox