import React, { Component } from "react";
import logo from "../../assets/logo.png";
import Deck2 from "./card/deck2";

import detailCard from './card/detailCard'
import ChatBox from './chat/index'
import ChatList from "./chat/chatList";
import Match from "./match/match";

import EditProfile from "../profile/edit";
import ResetPassword from "../profile/resetPassword";
// style
import "src/style/main.scss";
import "src/style/card.scss";

import { Link, useHistory, Redirect } from "react-router-dom";
import ROUTES from "../../global/routes";
import { Subscribe } from "unstated";
import { userAvatarUrl, MAIN_SCREEN, TITLES, NAVS } from "../../global/utils";
import UserContainer from "../../global/container/user";
import HomeScreenContainer from "../../global/container/homeScreen";
import ChatContainer from "../../global/container/chat";

import io from 'socket.io-client'
import { BASE_URL } from "../../global/api/var";
import ChatRequest from "../../global/api/chat";
import UserRequest from "../../global/api/user";

import Dialog from '@material-ui/core/Dialog';

function MatchDialog(props) {
  let {onClose, matchInfo, open} = props
  let yearOfBirth = parseInt(new Date().getFullYear()) - parseInt(matchInfo.birthdate.substring(0, 4))
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      style: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }}>
      <div id="match-dialog">
        <div id="match-dialog-title">You matched with</div>
        <img id="match-img" src={userAvatarUrl} style={{height: '40vh'}}/>
        <div id="match-info">{matchInfo.name} - {yearOfBirth}, {matchInfo.gender}</div>
      </div>
    </Dialog>
  )
}

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedOut: false,
      matchDialogOpened: false,
      matchInfo: null
    };
    this.socket = null
  }

  componentWillMount() {
    this.socket = io(BASE_URL);
  }

  async componentDidMount() {
    let chatCon = this.props.chatCon
    let userCon = this.props.userCon
    let homeCon = this.props.homeCon

    // get list chat/matches
    try {
      let page = chatCon.state.listChatPage
      let list = await ChatRequest.getChatList(page);
      await chatCon.saveChatList(list)

      let cards = await UserRequest.getCards(1);
      await homeCon.saveCards(cards)
      console.log(cards)
      if (!cards.length)
        homeCon.selectEmptyScreen()

      let matchesIds = list.map(e => e.users[0]._id)
      this.socket.emit('online', userCon.state.user._id, matchesIds)

    } catch (err) {
      console.log(err)
    }

    this.socket.on('matches-online', function (myOnlineMatches) {
      let list = chatCon.state.list
      let newList = list.map(item => {
        if (myOnlineMatches.includes(item.users[0]._id)) {
          item.online = true
        } else {
          item.online = false
        }
        return item
      })
      chatCon.saveChatList(newList)
    })

    this.socket.on('a-match-online', function (matchId) {
      let newList = handleStatus(matchId, true, chatCon.state.list)
      chatCon.saveChatList(newList)
      console.log(matchId + ' is now online!')
    })
    this.socket.on('a-match-offline', function (matchId) {
      let newList = handleStatus(matchId, false, chatCon.state.list)
      chatCon.saveChatList(newList)
      console.log(matchId + ' is now offline!')
    })

    this.socket.on('receive-match', async function (senderData) {
      console.log(senderData.info.name + ' matched with you!!!')
      // handle popover here
      let list = await ChatRequest.getChatList(1);
      chatCon.saveChatList(list)

      this.setState({
        matchDialogOpened: true,
        matchInfo: senderData.info
      })
    })

    this.socket.on('receive-message', async function (newMess, chatId, userId) {
      console.log(userId + ' is my Id receive mess')
      chatCon.saveNewMess(newMess, chatId)
      let selectedChat = chatCon.state.selectedChatInfo

      if (selectedChat &&
        selectedChat._id == chatId && homeCon.state.mainScreen // when user is chatting
        == MAIN_SCREEN.CHAT) {
        let readMessage = await ChatRequest.readMessage(chatId)
        let list = chatCon.state.list
        for (let item of list) {
          if (item._id == chatId) {
            item.usersRead = readMessage.usersRead; break
          }
        }
        chatCon.saveChatList(list)
      } else { // when user is not chatting
        let list = chatCon.state.list
        for (let item of list) {
          if (item._id == chatId) {
            let usersRead = item.usersRead.map(el => {
              if (el.userId == userId)
                el.read = false
              return el
            })
            item.usersRead = usersRead; break
          }
        }
        chatCon.saveChatList(list)
      }
    })

    function handleStatus(matchId, online, oldList) {
      let list = [...oldList]
      for (let item of list) {
        if (matchId == item.users[0]._id) {
          item.online = online
          break
        }
      }
      return list
    }
  }

  clickFooterAvatar() {
    let homeCon = this.props.homeCon
    switch (homeCon.state.nav) {
      case NAVS.MAIN:
        homeCon.selectNavProfile()
        break
      case NAVS.PROFILE:
        homeCon.selectNavMain()
        break
      default:
        homeCon.selectNavProfile()
        break
    }
  }

  render() {
    // get containers from HOC ----------
    let userCon = this.props.userCon
    let homeCon = this.props.homeCon
    let chatCon = this.props.chatCon

    // handle sign out here -----------
    if (this.state.signedOut) {
      localStorage.clear("token")
      userCon.resetData()
      homeCon.resetData()
      chatCon.resetData()
      if (this.socket) { this.socket.disconnect() }
      return <Redirect to={ROUTES.LANDING} />
    }

    // handle save userData ------------------
    let user = userCon.state.user
    let propsUser = this.props.user
    if (!user || (propsUser && user._id != propsUser._id)) {
      userCon.saveUserData(propsUser)
      user = propsUser
    }

    // Use var 'user' -> it has all the data needed
    return (<div id="main-screen">
      {/* this is a dialog to announce that have a match */}
      {this.state.matchDialogOpened 
      ? <MatchDialog matchInfo={this.state.matchInfo} 
        open={this.state.matchDialogOpened} 
        onClose={()=>this.setState({matchDialogOpened: false, matchInfo: null})}/>
      : null
      }
      <div id="nav">
        <div id="nav-logo">
          <Link to={ROUTES.LANDING}><img src={logo} height="30" /></Link>
        </div>
        <div id="nav-body">
          {this.genProfileNavTitles(user)}
        </div>
        <div id="nav-footer">
          <div id="nav-footer-avatar"
            onClick={() => this.clickFooterAvatar()}
            style={
              homeCon.state.nav == NAVS.MAIN
                ? { backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')` }
                : { backgroundColor: 'white' }
            }>
            {homeCon.state.nav == NAVS.MAIN
              ? <div></div>
              : <ion-icon name="chevron-back-outline"></ion-icon>}
          </div>
          {this.genFooter()}
        </div>
      </div>
      {this.genMainScreen()}
    </div>)
  }

  // Gen main screen here -------------------
  genMainScreen() {
    let homeCon = this.props.homeCon
    return homeCon.state.mainScreen == MAIN_SCREEN.DECK
      ? this.genDeckScreen()
      : homeCon.state.mainScreen == MAIN_SCREEN.CHAT
        ? this.genChatScreen()
        : homeCon.state.mainScreen == MAIN_SCREEN.EMPTY
          ? this.genEmptyScreen()
          : <div></div>
  }
  genDeckScreen() {
    return (
        <Deck2 socket={this.socket}
          chatCon={this.props.chatCon}
          homeCon={this.props.homeCon}
          user={this.props.user} />
    )
  }
  genChatScreen() {
    let homeCon = this.props.homeCon
    let chatCon = this.props.chatCon
    return (
      <div id="main-chat">
        <ChatBox socket={this.socket} homeCon={homeCon} chatCon={chatCon} />
        {detailCard(chatCon.state.selectedChatInfo.user.info)}
      </div>)
  }

  genEmptyScreen() {
    return (
      <div id="out-of-cards-screen">
        <img height="140" src="https://i.pinimg.com/originals/ee/e9/a0/eee9a0ee35cba67af8a64268d575d94b.gif"/>
        <div id="out-of-cards">Out of cards 😢<br/>You can edit gender/interest to explore more</div>
      </div>
    )
  }

  // Gen main nav here -------------------
  genMainNav() {
    let homeCon = this.props.homeCon
    let chatCon = this.props.chatCon
    let userCon = this.props.userCon
    return (<div>
      <div id="nav-titles">{this.genMainNavTitles()}</div>
      <div id="nav-main">
        {homeCon.state.navTitle == TITLES.CHAT
          ? <ChatList socket={this.socket} homeCon={homeCon} chatCon={chatCon} user={userCon.state.user} />
          : <Match socket={this.socket} homeCon={homeCon} chatCon={chatCon} />}
      </div>
    </div>)
  }
  // Gen main nav titles UI here -------------------
  genMainNavTitles() {
    let homeCon = this.props.homeCon
    let chatCon = this.props.chatCon
    let userId = this.props.user._id

    let countUnreadChat = ''
    if (chatCon.state.list) {
      countUnreadChat = chatCon.state.list.filter(item => {
        return (item.usersRead && item.usersRead.filter(e => (e.userId == userId && e.read == false)).length && item.messages.length)
      }).length || ''
    }
    let list = [TITLES.MATCH, TITLES.CHAT].map((navTitle, index) => {
      return (
        <div
          onClick={
            navTitle == TITLES.MATCH
              ? () => homeCon.selectNavTitlesMatch()
              : () => homeCon.selectNavTitlesChat()
          }
          key={index}
          className={[
            "nav-title",
            navTitle == homeCon.state.navTitle ? "chosen-nav-title" : "unchosen-nav-title",
          ].join(" ")}
        >
          {navTitle}
          {navTitle == TITLES.MATCH ? '' : countUnreadChat ? <span id="noti-tile">{countUnreadChat}</span> : ''}
        </div>
      );
    });
    return list;
  }

  // Gen profile nav here -------------------
  genProfileNav(user) {
    let homeCon = this.props.homeCon
    const thisYear = new Date().getFullYear()
    function getYear(isoStr) {
      return new Date(isoStr).getFullYear()
    }
    return (
      <div id="nav-profile">
        <div id="profile-avatar"
          style={{ backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')` }}
        ></div>
        <div id="profile-name">{user.info.name}</div>
        <div id="profile-sub-info">{thisYear - getYear(user.info.birthdate)} - {user.info.gender}</div>
        <div id="profile-options">
          <div className="profile-opt" id="opt-detail-info" onClick={() => homeCon.selectNavEditProfile()}>Edit Profile</div>
          <div className="profile-opt" id="opt-change-password" onClick={() => homeCon.selectNavResetPassword()}>Reset Password</div>
          <div className="profile-opt" id="opt-sign-out" onClick={() => this.setState({ signedOut: true })}>
            Sign out
          </div>
        </div>
      </div>
    )
  }
  // gen profile options UI here (not main nav - update UI in left nav)
  genProfileNavTitles(user) {
    let homeCon = this.props.homeCon
    let nav = this.genMainNav()
    switch (homeCon.state.nav) {
      case NAVS.PROFILE:
        nav = this.genProfileNav(user)
        break
      case NAVS.EDIT_PROFILE:
        nav = <EditProfile />
        break
      case NAVS.RESET_PASSWORD:
        nav = <ResetPassword />
        break
      default:
        nav = this.genMainNav()
        break
    }
    return nav
  }

  // gen footer here ----------------
  genFooter() {
    let homeCon = this.props.homeCon

    let footer = this.genMainFooter()

    if (homeCon.state.nav != NAVS.MAIN)
      footer = this.genProfileFooter()

    return footer
  }
  genMainFooter() {
    let homeCon = this.props.homeCon
    return (<div
      id="nav-footer-text"
      onClick={
        () => homeCon.selectNavProfile()}
    >
      To my account
      <span style={{ marginLeft: 7 }}>➝</span>
    </div>)
  }
  genProfileFooter() {
    let homeCon = this.props.homeCon
    return (<div
      id="nav-footer-text"
      onClick={() => homeCon.selectNavMain()}
    >
      To main navigation
      <span style={{ marginLeft: 7 }}>➝</span>
    </div>)
  }
}

class Home extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Subscribe to={[UserContainer, HomeScreenContainer, ChatContainer]}>
        {(userCon, homeCon, chatCon) => <HomeComponent
          user={this.props.user} userCon={userCon} homeCon={homeCon} chatCon={chatCon} />}
      </Subscribe>
    )
  }
}

export default Home;
