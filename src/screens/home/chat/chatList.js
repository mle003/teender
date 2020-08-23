import React, {Component} from 'react';
import 'src/style/chat.scss';
import ChatRequest from '../../../global/api/chat';
import { errorLoadingGifUrl } from 'src/global/utils'
import { Subscribe } from 'unstated';
import ChatContainer from '../../../global/container/chat';

class ChatList extends Component {
  constructor(props) {
    super(props)
  }

  async clickChatTile(chatId) {
    await this.props.chatCon.selectChatChannel(chatId)
    this.props.homeCon.selectChatScreen()
  }

  render() {
    let list = this.props.chatCon.state.list
    return (
    <Subscribe to={[ChatContainer]}>
      {container => !list || !list.length
      ? <div id="chat-part"></div>
      : <div id="chat-list">
          {list.map(item => item.messages.length ? this.chatTile(item) : <span></span>)}
        </div>
      }
    </Subscribe>
    )
  }

  chatTile(item) {
    return (
    <div className="chat-tile" onClick={()=>this.clickChatTile(item._id)}>
      <div className="chat-tile-new-container">
        <div className="chat-tile-new-dot"></div>
      </div>
      <div className="chat-tile-avatar-container">
        <div className="chat-tile-avatar" style={{backgroundImage: `url('${item.users[0].info.imgUrl || errorLoadingGifUrl}')`}}></div>
      </div>
      <div className="chat-tile-info">
        <div className="chat-tile-name">{item.users[0].info.name}</div>
        <div className="chat-tile-text">{item.messages[0].type == "image" ? "Tin nhắn hình ảnh" : item.messages[0].content}</div>
      </div>
    </div>)
  }
}

export default ChatList