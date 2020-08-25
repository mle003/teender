import React, {Component} from 'react';
import 'src/style/chat.scss';
import ChatRequest from '../../../global/api/chat';
import { errorLoadingGifUrl } from 'src/global/utils'
import { Subscribe } from 'unstated';
import ChatContainer from '../../../global/container/chat';
import { MAIN_SCREEN } from '../../../global/utils';

class ChatList extends Component {
  constructor(props) {
    super(props)
  }

  async clickChatTile(chatId) {
    let homeCon = this.props.homeCon
    let chatCon = this.props.chatCon
    await ChatRequest.readMessage(chatId)
    await chatCon.selectChatChannel(chatId)
    if(homeCon.state.mainScreen != MAIN_SCREEN.CHAT)
      homeCon.selectChatScreen()
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
    let read = false
    for(let u of item.usersRead) {
      if (u.userId == this.props.user._id) {
        read = u.read; break
      }
    }

    let preMess = item.messages[0].owner == this.props.user._id ? 'You: ' : ''

    return (
    <div className="chat-tile" onClick={()=>this.clickChatTile(item._id)}>
      <div className="chat-tile-avatar-container">
        <div className="chat-tile-avatar" style={{backgroundImage: `url('${item.users[0].info.imgUrl || errorLoadingGifUrl}')`}}>
          {item.online ? <div className="chat-tile-online-dot"></div> : <div></div>}
        </div>
      </div>
      <div className="chat-tile-info">
        <div className="chat-tile-name">{item.users[0].info.name}</div>
        <div className="chat-tile-text" 
          style={{fontWeight: read ? 300 : 500}}
        >{item.messages[0].type == "image" ? "Sticker/Image 🤡" : preMess + item.messages[0].content}</div>
      </div>
      <div className="chat-tile-new-container">
        {read ? <div></div> : <div className="chat-tile-new-dot"></div>}
      </div>
    </div>)
  }
}

export default ChatList