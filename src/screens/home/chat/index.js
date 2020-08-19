import React, { Component } from "react";
import "src/style/chat.scss";
import io from "socket.io-client";
import Axios from "axios";

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requesting: false,
      listInQueue: false,
      chatMessage: "",
      value: "",
      users: ["5f2d820c874cfd554063c70b", "5f2ea9d4bde78b10c0c8ce87"],
      createdAt: "2020-08-08T13:34:41.967Z",
      messages: [],
      currentUser: "5f2ea9d4bde78b10c0c8ce87",
    };

    this.submitMessage = this.submitMessage.bind(this);
    this.callApiChatList = this.callApiChatList.bind(this);
    // initSocket = this.initSocket.bind(this);
  }

  componentDidMount() {
    let socketUrl = "http://localhost:9000";
    this.socket = io(socketUrl);

    let state = this.state;
    this.callApiChatList(state);

    this.socket.on("Output Chat Message", (message) => {
      Axios.request({
        url: "http://localhost:9000/api/chat",
        method: "POST",
        data: message,
      }).then((res) => {
        this.setState({ messages: res.data.messages });
        console.log(res);
      });
    });
  }

  callApiChatList(state) {
    if (this.state.requesting) {
      this.setState({ listInQueue: true });
      return;
    }

    let users = state.users;

    Axios.request({
      url: "http://localhost:9000/api/findUsersChat",
      method: "POST",
      data: { users },
    })
      .then((res) => {
        this.setState({ messages: res.data.messages });
        // console.log(res);
      })
      .finally(() => {
        this.setState({ requesting: false });

        if (this.state.listInQueue) {
          this.setState({ listInQueue: false });
          this.callApiChatList(this.state);
        }
      });
  }

  handleChange = (e) => {
    this.setState({ chatMessage: e.target.value });
    // console.log(e.target.value);
  };

  submitMessage(e) {
    e.preventDefault();
    let { chatMessage, currentUser } = this.state;
    if (chatMessage) {
      this.setState({ value: chatMessage.trim() });
      // console.log(message);

      let users = this.state.users;
      let createdAt = this.state.createdAt;

      let messages = {
        content: chatMessage,
        owner: currentUser,
        createdAt: new Date().toISOString(),
      };

      this.socket.emit("Input Chat Message", {
        users,
        createdAt,
        messages,
      });
      this.setState({ chatMessage: "" });
      // // socket.on("result", message)
    }
  }

  render() {
    let { messages, currentUser } = this.state;
    return (
      <div id="chat-box">
        <div id="chat-header">
          <div id="chat-header-avatar-container">
            <div
              id="chat-header-avatar"
              style={{
                backgroundImage:
                  "url('https://www.shorturl.at/img/shorturl-square.png')",
              }}
            ></div>
          </div>
          <div id="chat-header-text">
            <div id="chat-header-name">Hello Hello</div>
            <div id="chat-header-info">You match with Hello on 12/12/2012</div>
          </div>
          <button id="chat-close-button" type="button">
            <ion-icon id="chat-close-icon" name="close"></ion-icon>
          </button>
        </div>
        <div id="chat-body">
          {messages.map(function (message, i) {
            // console.log(message);
            let user, style;
            if (message.owner == currentUser) {
              user = "mess sent-mess";
              style = {
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              };
            } else {
              user = "mess received-mess";
              style = {
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              };
            }
            return (
              <div style={style}>
                <div className={user} key={i}>
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>
        <div id="chat-footer">
          <form id="chat-form" onSubmit={this.submitMessage}>
            <input
              id="chat-input"
              placeholder="Type something..."
              value={this.state.chatMessage}
              onChange={this.handleChange}
            />
            <button id="send-button" type="submit">
              <ion-icon name="send" id="send-icon"></ion-icon>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ChatBox;
