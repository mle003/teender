import React, { Component } from "react";
import logo from "../../assets/logo.png";
import Deck from "./card/deck";
import Deck2 from "./card/deck2";
import detailCard from './card/detailCard'
import ChatBox from './chat/index'
import chatList from "./chat/chatList";
import Match from "./match/match";

import EditProfile from "../profile/edit";
import ResetPassword from "../profile/resetPassword";

// style
import "src/style/main.scss";
import "src/style/card.scss";

import { Link, useHistory, Redirect } from "react-router-dom";
import ROUTES from "../../global/routes";
import { Subscribe } from "unstated";
import { userAvatarUrl, MAIN_SCREEN } from "../../global/utils";
import UserContainer from "../../global/container/user";
import HomeScreenContainer from "../../global/container/homeScreen";


const TITLES = {
  MATCH: 'Match',
  MESSAGE: 'Message',
}

const NAVS = {
  MAIN: 'Main',
  PROFILE: 'Profile',
  EDIT: 'Edit Profile',
  RESET: 'Reset Password'
}

function genDeckScreen() {
  return (
    <div id="main-deck">
      <div id="cards-stack">
        <Deck2 />
      </div>
      <div id="instruction"></div>
    </div>)
}

function genChatScreen(container) {
  let selectedUser = container.state.selectedUser
  return (
    <div id="main-chat">
      <ChatBox selectedUser={selectedUser} container={container}/>
      {detailCard(selectedUser.info)}
    </div>)
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedOut: false,
      arrowMargin: 5,

      chosenMainNavTitle: TITLES.MATCH,
      nav: NAVS.MAIN
    };
  }

  clickChangeNav(navName) {
    this.setState({
      nav: navName
    })
  }

  
  clickMainNavTitle(navTitle) {
    // change state when choose a different navTitle
    if (this.state.chosenMainNavTitle != navTitle) this.setState({ chosenMainNavTitle: navTitle });
    // handle xong cuối cùng là chọn index.

    switch (navTitle) {
      case TITLES.MATCH:
        // handle call api here
        break;
      case TITLES.MESSAGE:
        // handle call api here
        break;
      default:
        break;
    }
  }

  clickFooterAvatar() {
    if (this.state.nav == NAVS.MAIN) {
      this.clickChangeNav(NAVS.PROFILE)
    } else if (this.state.nav == NAVS.PROFILE) {
      this.clickChangeNav(NAVS.MAIN)
    } else {
      this.clickChangeNav(NAVS.PROFILE)
    }
  }

  clickSignOut() {
    localStorage.clear("token")
    this.setState({signedOut: true})
  }

  render() {
    return (
    <Subscribe to={[UserContainer, HomeScreenContainer]}>
      {(userCon, homeCon) => {
        if (this.state.signedOut) {
          userCon.resetData()
          homeCon.resetData()
          return <Redirect to={ROUTES.LANDING}/>
        }
        let thisMainScreen = homeCon.state.mainScreen
        let user = userCon.state.user
        let propsUser = this.props.user
        if (!user) {
          userCon.saveUserData(propsUser)
          user = propsUser
        } else if (!!propsUser && user.email != propsUser.email) {
          userCon.saveUserData(propsUser)
          user = propsUser
        }
        // Use var 'user' -> it has all the data needed
        return(<div id="main-screen">
        <div id="nav">
          <div id="nav-logo">
            <Link to={ROUTES.LANDING}><img src={logo} height="30" /></Link>
          </div>
          <div id="nav-body">
            {this.genNav(user)}
          </div>
          <div id="nav-footer">
            <div id="nav-footer-avatar"
              onClick={()=>this.clickFooterAvatar()}
              style={
                this.state.nav == NAVS.MAIN 
                ? {backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')`}
                : {backgroundColor: 'white'}
              }>
              {this.state.nav == NAVS.MAIN 
                ? <div></div> 
                : <ion-icon name="chevron-back-outline"></ion-icon>}
            </div>
            {this.genFooter()}
          </div>
        </div>
        {thisMainScreen == MAIN_SCREEN.DECK 
          ? genDeckScreen()
          : thisMainScreen == MAIN_SCREEN.CHAT 
            ? genChatScreen(homeCon)
            : <div></div>
        }
      </div>)}}
    </Subscribe>
    );
  }

  genMainNav() {
    return (<div>
      <div id="nav-titles">{this.genMainNavTitles()}</div>
      <div id="nav-main">
        {this.state.chosenMainNavTitle == TITLES.MESSAGE ? chatList() : <Match/>}
      </div>
    </div>)
  }

  genMainNavTitles() {
    let list = [TITLES.MATCH, TITLES.MESSAGE].map((navTitle, index) => {
      return (
        <div
          onClick={() => this.clickMainNavTitle(navTitle)}
          key={index}
          className={[
            "nav-title",
            navTitle == this.state.chosenMainNavTitle ? "chosen-nav-title" : "unchosen-nav-title",
          ].join(" ")}
        >
          {navTitle}
        </div>
      );
    });
    return list;
  }

  genProfileNav(user) {
    const thisYear = new Date().getFullYear()
    function getYear(isoStr) {
      return new Date(isoStr).getFullYear()
    }
    return (
      <div id="nav-profile">
        <div id="profile-avatar" 
          style={{backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')`}}
        ></div>
        <div id="profile-name">{user.info.name}</div>
        <div id="profile-sub-info">{thisYear - getYear(user.info.birthdate)} - {user.info.gender}</div>
        <div id="profile-options">
          <div className="profile-opt" id="opt-detail-info" onClick={()=>this.clickChangeNav(NAVS.EDIT)}>Edit Profile</div>
          <div className="profile-opt" id="opt-change-password" onClick={()=>this.clickChangeNav(NAVS.RESET)}>Reset Password</div>
          <div className="profile-opt" id="opt-sign-out" onClick={()=>this.clickSignOut()}>
            Sign out
          </div>
        </div>
      </div>
    )
  }

  genNav(user) {
    let nav = this.genMainNav()
    switch(this.state.nav) {
      case NAVS.PROFILE:
        nav = this.genProfileNav(user)
      break
      case NAVS.EDIT:
        nav = <EditProfile/>
      break
      case NAVS.RESET:
        nav = <ResetPassword/>
      break
      default:
        nav = this.genMainNav()
      break
    }
    return nav
  }
  
  genMainFooter() {
    return (<div
      id="nav-footer-text"
      onMouseOver={() =>
        this.setState({ ...this.state, arrowMargin: 12 })
      }
      onMouseOut={() =>
        this.setState({ ...this.state, arrowMargin: 5 })
      }
      onClick={
        () => this.clickChangeNav(NAVS.PROFILE)}
    >
      To my account
    <span style={{ marginLeft: this.state.arrowMargin }}>➝</span>
    </div>)
  }

  genProfileFooter() {
    return (<div
      id="nav-footer-text"
      onClick={() => this.clickChangeNav(NAVS.MAIN)}
    >
      To main navigation
    <span style={{ marginLeft: this.state.arrowMargin }}>➝</span>
    </div>)
  }

  genFooter() {
    let footer = this.genMainFooter() 
    if (this.state.nav != NAVS.MAIN) 
      footer = this.genProfileFooter()
    return footer
  }
}

export default Home;
