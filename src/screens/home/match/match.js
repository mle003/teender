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

  clickMatchCard(chatId) {
    this.props.chatCon.selectChatChannel(chatId)
    this.props.homeCon.selectChatScreen()
  }

  render() {
    let list = this.props.chatCon.state.list
    return (
    <Subscribe to={[ChatContainer]}>
      {container => 
        list == null 
          ? <div className="match-part"><div></div></div>
          :  !list.length 
            ? <div className="match-part" style={{display: 'block'}}><div id="match-empty-part">💕 Your matches will be shown here, soon! 💕</div> </div>
            : <div className="match-part">{list.map(data => this.matchCard(data.users[0], data._id))}</div>
      }
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