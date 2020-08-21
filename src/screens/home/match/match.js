import React, { Component, useRef } from 'react';
import 'src/style/match.scss'
import ChatRequest from '../../../global/api/chat';
import {userAvatarUrl, MAIN_SCREEN} from '../../../global/utils'
import { Subscribe } from 'unstated';
import ChatContainer from '../../../global/container/chat';

class Match extends Component {
  constructor(props) {
    super(props)
  }

  // move to homescreen -> when socket successfully implemented
  async componentDidMount() {
    try {
      let list = await ChatRequest.getListChat(1);
      this.props.chatCon.saveChatList(list)
    } catch (err) {
      console.log(err)
    }
  }

  async clickMatchCard(chatId) {
    await this.props.chatCon.selectChatChannel(chatId)
    this.props.homeCon.selectChatScreen()
  }

  render() {
    let list = this.props.chatCon.state.list
    return (
    <Subscribe to={[ChatContainer]}>
      {container => <div className="match-part">
        {list == null 
          ? <div></div>
          :  !list.length 
            ? <div id="match-empty-part">💕 Your matches will be shown here, soon! 💕</div> 
            :  list.map(data => this.matchCard(data.users[0], data._id))}
      </div>}
    </Subscribe>
    )
  }

  matchCard(data, chatId) {
      return (<div className="match-card-container" onClick={()=>this.clickMatchCard(chatId)}>
          <div className="match-card" style={{ backgroundImage: `url(${data.info.imgUrl || userAvatarUrl})` }}>
            <div className="match-card-filter">
              <div className="match-card-name">{data.info.name}</div>
            </div>
          </div>
        </div>)
  }
}




export default Match