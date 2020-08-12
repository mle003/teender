import React, { Component } from "react";
import logo from "../../assets/logo.png"
import Deck from "./card/deck";
import ChatBox from './chat/index'
import detailCard from './card/detailCard'
import Match from "./match";
import ChatList from "./chat/chatList";

// style
import "src/style/main.scss";

// import axios from "axios";
// import './style.css'

function deckScreen() {
  return (
  <div id="main-deck">
    <div id="cards-stack">
      <Deck />
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
      navTitles: ["Match", "Message"],
      chosenIndex: 0,
      arrowMargin: 5,
    };
  }
  componentWillMount() {
    let teenderToken = localStorage.getItem('teenderToken')
    console.log(teenderToken)
    // handle checking auth here
    
  }

  genTitles(titles, chosenIndex) {
    let list = titles.map((item, index) => {
      return (
        <div
          onClick={() => {
            if (chosenIndex != index) this.setState({ chosenIndex: index });
          }}
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
    let { navTitles, chosenIndex } = this.state;
    return (<div id="main-screen">
        <div id="nav">
          <div id="nav-logo">
            <img src={logo} height="30" />
          </div>
          <div id="nav-body">
            <div id="nav-titles">{this.genTitles(navTitles, chosenIndex)}</div>
            <div id="nav-main">
              <ChatList />
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
        {chatScreen()}
      </div>)}
}

export default Home;
