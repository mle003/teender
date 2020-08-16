import React from 'react';
import 'src/style/chat.scss';

function chatList() {
  return (
    <div id="chat-part">
      <ChatTile/>
      <ChatTile/>
      <ChatTile/>
    </div>
  )
}

function ChatTile() {
  return (
  <div className="chat-tile">
    <div className="chat-tile-new-container">
      <div className="chat-tile-new-dot"></div>
    </div>
    <div className="chat-tile-avatar" style={{backgroundImage: "url('https://live.staticflickr.com/2734/4353428267_bba2b6f6f8.jpg')"}}></div>
    <div className="chat-tile-info">
      <div className="chat-tile-name">Hello Hello</div>
      <div className="chat-tile-text">new message</div>
    </div>
  </div>)
}

export default chatList