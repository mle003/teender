import React, { Component } from "react";
import logo from "../../assets/logo.png";
import Deck from "./card/deck";
// style
import "src/style/main.scss";
import "src/style/card.scss";

import Match from "./match";
import MyContainer from "../../global/state.js";
import Deck2 from "./card/deck2";
import { Link } from "react-router-dom";
import ROUTES from "../../global/routes";
// import './style.css'

import detailCard from './card/detailCard'
import ChatBox from './chat/index'
import chatList from "./chat/chatList";

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
    <ChatBox/>
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

  genTitles(titles, chosenIndex) {
    console.log("container props from home", MyContainer);
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
      <div id="main-screen">
        {/* <Subscribe to={[MyContainer]}>
          {(container) => {
            let user = this.state.user;
          }}
        </Subscribe> */}
        <div id="nav">
          <div id="nav-logo">
            <Link to={ROUTES.LANDING}><img src={logo} height="30"/></Link>
          </div>
          <div id="nav-body">
            <div id="nav-titles">{this.genTitles(NAV_TITLES, chosenIndex)}</div>
            <div id="nav-main">
              {NAV_TITLES[this.state.chosenIndex] == TITLES.MESSAGE ? chatList() : <Match/>}
            </div>
          </div>
          <div id="nav-footer">
            <div id="nav-footer-avatar"></div>
            <div
              id="nav-footer-text"
              onMouseOver={() =>
                this.setState({ ...this.state, arrowMargin: 12 })
              }
              onMouseOut={() =>
                this.setState({ ...this.state, arrowMargin: 5 })
              }
            >
              To my profile
              <span style={{ marginLeft: this.state.arrowMargin }}>➝</span>
            </div>
          </div>
        </div>
        {NAV_TITLES[this.state.chosenIndex] == TITLES.MESSAGE ? chatScreen() : deckScreen()}
      </div>
    );
  }
}

export default Home;
