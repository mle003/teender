import React, { Component, useEffect, useState } from "react";
import "src/style/match.scss";
class MatchCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let info = this.props.info;
    // this.setState({
    //   name: this.props.info.name,
    //   avatar: this.state.info.imgUrl,
    // });
    // console.log("props", this.state.avatar);
    return (
      <div className="match-card-container">
        {info.map((v) => {
          return (
            <div
              className="match-card"
              style={{ backgroundImage: `url(${v.info.imgUrl})` }}
            >
              <div className="match-card-filter">
                <div className="match-card-name">{v.info.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default MatchCard;
