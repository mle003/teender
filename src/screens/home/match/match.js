import React, { Component, useRef } from 'react';
import 'src/style/match.scss'
import UserRequest from '../../../global/api/user';
import {userAvatarUrl, MAIN_SCREEN} from '../../../global/utils'
import { Subscribe } from 'unstated';
import HomeScreenContainer from '../../../global/container/homeScreen';

class Match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: null
    }
  }

  async componentWillMount() {
    let matches = await UserRequest.getMatch(1);
    this.setState({
      matches: matches,
    });
  }

  render() {
    let matches = this.state.matches
    return (
      <div className="match-part">
        {matches == null 
          ? <div></div>
          :  !matches.length 
            ? <div id="match-empty-part">💕 Your matches will be shown here, soon! 💕</div> 
            :  matches.map(data => matchCard(data))}
      </div>
    )
  }
}


function matchCard(data) {
// a contains following fields: info, createdAt, _id
return (<Subscribe to={[HomeScreenContainer]}>
  {container => {
    return (<div className="match-card-container" onClick={()=>container.selectChatScreen(data)}>
      <div className="match-card" style={{ backgroundImage: `url(${data.info.imgUrl || userAvatarUrl})` }}>
        <div className="match-card-filter">
          <div className="match-card-name">{data.info.name}</div>
        </div>
      </div>
    </div>)}
  }
</Subscribe>);
}

export default Match