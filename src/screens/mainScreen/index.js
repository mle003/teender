import React, { Component } from "react";
import { Card, CardWrapper } from "react-swipeable-cards";
import logo from "../../assets/logo.png";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navTitles: ["Match", "Message"],
      chosenIndex: 0,
      arrowMargin: 5,
    };
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
    return (
      <div id="main-screen">
        <div id="nav">
          <div id="nav-logo">
            <img src={logo} height="30" />
          </div>
          <div id="nav-body">
            <div id="nav-titles">{this.genTitles(navTitles, chosenIndex)}</div>
            <div id="nav-main"></div>
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
        <div id="main">
          <div id="card-wrapper">
            <CardWrapper>
              <Card>Hello World 1!</Card>
              <Card>Hello World 2!</Card>
            </CardWrapper>
          </div>
          <div id="instruction"></div>
        </div>
      </div>
    );
  }
}

export default MainScreen;
