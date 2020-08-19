import React, { Component, useEffect, useState } from "react";
import "src/style/match.scss";
import Axios from "axios";
import MatchCard from "./matchCard";
// import { render } from "sass";

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
    };
  }
  async componentWillMount() {
    let res = await Axios.request({
      url: "http://localhost:9000/api/match",
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    let userInfo = res.data.data;
    this.setState({
      info: userInfo,
    });
  }
  render() {
    return this.state.info != null ? (
      <div className="match-part">
        <MatchCard info={this.state.info} />
      </div>
    ) : null;
  }
}

export default Match;
