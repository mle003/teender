import React, { Component } from 'react'
import {ReceivedMess, SentMess} from './bubble'
import 'src/style/chat.scss'
import { userAvatarUrl, MAIN_SCREEN } from '../../../global/utils'
import ChatRequest from '../../../global/api/chat'
import { Subscribe } from 'unstated'
import ChatContainer from '../../../global/container/chat'
import Popover from '@material-ui/core/Popover'

class ChatBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentMessage: '',
      sendingOnload: false,
      errorSendingMess: '',
      anchorStickerPopper: null
    }
    this.chatListRef = React.createRef()
    this.socket = this.props.socket
  }

  scrollToBottom = () => {
    this.chatListRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start'  });
  }

  // async readMessAndUpdate(chatCon, selectedChat) {
  //   let readMessage = await ChatRequest.readMessage(selectedChat._id)
  //   let list = chatCon.state.list
  //   for (let e of list) {
  //     if(e._id == selectedChat._id)
  //       e.usersRead = readMessage.usersRead; break
  //   }
  //   chatCon.saveChatList(list)
  // }

  async loadMoreOldMessages() {
    let chatCon = this.props.chatCon
    await chatCon.increaseMessagePage()
    let page = this.props.chatCon.state.messagePage
    let size = page == 1 ? this.props.chatCon.state.messages.length : 20
    let chatId = this.props.chatCon.state.selectedChatInfo._id

    let oldMessages = await ChatRequest.getMessage(chatId, page, size)
    oldMessages = oldMessages.messages
    
    if (oldMessages.length) {
      chatCon.loadMoreOldMessages(oldMessages)
    } else {
      chatCon.setLoadedMess(true)
    }
  }

  async handleSendMessage(e, type) {
    e.preventDefault()
    try {
      this.setState({sendingOnload: true})
      let chatId = this.props.chatCon.state.selectedChatInfo._id
      let matchId = this.props.chatCon.state.selectedChatInfo.user._id
      let content = type == 'image' ? e.target.src : this.state.contentMessage
      if (!content.trim()) {
        throw new Error('')
      }
      let mess = {
        content,
        type
      }
      // api here
      let newMessData = await ChatRequest.sendMessage(mess, chatId, matchId)
      this.socket.emit('send-message', newMessData.messages[0], chatId, matchId)
      this.props.chatCon.saveNewMess(newMessData.messages[0], chatId)
      this.setState({sendingOnload: false, contentMessage: '', anchorStickerPopper: null})
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
      {container => 
      <div id="chat-box">
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
            onClick={()=>{this.props.homeCon.selectDeckScreen(); this.props.chatCon.closeChatInfo()}}
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
            style={{display: this.props.chatCon.state.loadedAllMess ? 'none' : 'block'}}
            onClick={()=>this.loadMoreOldMessages()}>
              Load older messages...
          </div>
          }
        </div>
        <div id="chat-footer" >
          <div id="read-new-mess" 
            style={{}}>
            <span onClick={()=>this.scrollToBottom()}
              >Scroll to bottom <ion-icon name="chevron-down-outline"></ion-icon></span>
          </div>
          <form id="chat-form" onSubmit={e=>this.handleSendMessage(e, 'text')}>
            <div className="chat-input-container">
              <input id="chat-input" 
                value={this.state.contentMessage} 
                onChange={e=>this.setState({contentMessage: e.target.value, errorSendingMess: ''})} 
                placeholder="Type something..."/>
              <div className="err-message">{this.state.errorSendingMess}</div>
            </div>      
            <button id="chat-button" type="button" 
              onClick={e=>this.setState({anchorStickerPopper: e.currentTarget})}>
                <ion-icon name="happy-outline" id="chat-icon"
                  style={{color: !!this.state.anchorStickerPopper ? '#a778b6' : 'gray'}}
                  ></ion-icon>
            </button>
            <Popover 
              open={!!this.state.anchorStickerPopper}
              anchorEl={this.state.anchorStickerPopper}
              onClose={e=>this.setState({anchorStickerPopper: null})}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <div>
              {this.stickersTemplate()}
              </div>
            </Popover>
            <button id="chat-button-send" disabled={this.state.sendingOnload}><ion-icon name="send" id="chat-icon-send"></ion-icon></button>
          </form>
        </div>
      </div>}
    </Subscribe>
    )
  }

  stickersTemplate() {return (<div id="stickers-table"><img loading="lazy" class="alignnone size-full wp-image-155374" 
  onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-16_217563.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155375" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-17_375325.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155376" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-18_476256.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155377" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-19_813750.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155378" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-21_133477.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155379" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-22_293878.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155380" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-23_767995.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155381" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-25_143029.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155382" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-26_229713.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155383" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-27_551542.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155384" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-28_925937.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155385" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-30_271533.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155386" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-31_607742.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155387" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-32_744465.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155388" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-33_831942.gif"  width="80" height="80"/> <img loading="lazy" class="alignnone size-full wp-image-155389" onClick={e=>this.handleSendMessage(e, 'image')} src="https://pic.chinesefontdesign.com/uploads/2018/01/chinesefontdesign.com-2018-01-04_11-06-34_894287.gif"  width="80" height="80"/></div>)}
}

export default ChatBox