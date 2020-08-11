import React, { useState, useEffect } from "react";
import 'src/style/card.scss'

const year = parseInt(new Date().getFullYear());

function Card(item) {
  return (<animated.div
    {...bind(i)}
    onDoubleClick={(e) => clickInfo(e)}
    className="card"
    style={{
      transform: interpolate([rot, scale], trans),
      backgroundImage: `url(${item.info.imgUrl})`,
    }}
  >
    <div className="card-info">
      <div className="big-info">
        {item.info.name}{" "}
        {year - parseInt(item.info.birthdate.substring(0, 4))}
        <ion-icon
          name={item.info.gender == "male" ? "male" : "female"}
          style={{ position: "relative", bottom: -2, marginLeft: 5 }}
        ></ion-icon>
        <ion-icon
          onClick={(e) => clickInfo(e)}
          name="information-circle"
          class="info-icon"
          style={{ position: "relative", bottom: -2.5, marginLeft: 5 }}
        ></ion-icon>
      </div>
      <div className="small-info">{item.info.desc}</div>
    </div>
  </animated.div>)
}

export default Card