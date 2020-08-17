import React, { Component } from "react";
import logo from "../../assets/logo.png";
import Deck from "./card/deck";
import Deck2 from "./card/deck2";
import detailCard from './card/detailCard'
import ChatBox from './chat/index'
import chatList from "./chat/chatList";
import Match from "./match";

import Profile from "../profile";
import EditProfile from "../profile/edit";

// style
import "src/style/main.scss";
import "src/style/card.scss";

import MyContainer from "../../global/state.js";
import { Link } from "react-router-dom";
import ROUTES from "../../global/routes";
import { Subscribe } from "unstated";

const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'

const TITLES = {
  MATCH: 'Match',
  MESSAGE: 'Message',
}
const NAV_TITLES = [TITLES.MATCH, TITLES.MESSAGE]

function deckScreen() {
  return (
    <div id="main-deck">
      <div id="cards-stack">
        <Deck2 />
      </div>
      <div id="instruction"></div>
    </div>)
}
function chatScreen() {
  return (
    <div id="main-chat">
      <ChatBox />
      {detailCard()}
    </div>)
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenIndex: 0,
      arrowMargin: 5,
      infos: [],
    };
  }

  clickNavButton(chosenIndex, index) {
    if (chosenIndex != index) this.setState({ chosenIndex: index });
    // handle xong cuối cùng là chọn index. Không dùng NAV_TITLES[this.state.chosenIndex] vì setState bất đồng bộ
    switch (NAV_TITLES[index]) {
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

  toProfileButton() {
    return (<div
      id="nav-footer-text"
      onMouseOver={() =>
        this.setState({ ...this.state, arrowMargin: 12 })
      }
      onMouseOut={() =>
        this.setState({ ...this.state, arrowMargin: 5 })
      }
    >
      To my account
    <span style={{ marginLeft: this.state.arrowMargin }}>➝</span>
    </div>)
  }

  genTitles(titles, chosenIndex) {
    let list = titles.map((item, index) => {
      return (
        <div
          onClick={() => this.clickNavButton(chosenIndex, index)}
          key={index}
          className={[
            "nav-title",
            index == chosenIndex ? "chosen-nav-title" : "unchosen-nav-title",
          ].join(" ")}
        >
          {item}
        </div>
      );
    });
    return list;
  }
  render() {
    let { chosenIndex } = this.state;
    return (
    <Subscribe to={[MyContainer]}>
      {container => {
        let user = container.state.user
        let propsUser = this.props.user
        if (!user) {
          container.saveUserData(propsUser)
          user = propsUser
        } else if (!!propsUser && user.email != propsUser.email) {
          container.saveUserData(propsUser)
          user = propsUser
        }
        return(<div id="main-screen">
        <div id="nav">
          <div id="nav-logo">
            <Link to={ROUTES.LANDING}><img src={logo} height="30" /></Link>
          </div>
          <div id="nav-body">
            <EditProfile/>
            {/* <div id="nav-titles">{this.genTitles(NAV_TITLES, chosenIndex)}</div>
            <div id="nav-main">
              {NAV_TITLES[this.state.chosenIndex] == TITLES.MESSAGE ? chatList() : <Match/>}
            </div> */}
          </div>
          <div id="nav-footer">
            <div id="nav-footer-avatar"
              style={{backgroundImage: `url('${user.info.imgUrl || userAvatarUrl}')`}}
            ></div>
            {this.toProfileButton()}
          </div>
        </div>
        {deckScreen()}
      </div>)}}
    </Subscribe>
    );
  }
}

export default Home;
