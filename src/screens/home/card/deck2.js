import React, { useState, useEffect } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import axios from "axios";
import likeImgUrl from "src/assets/like.png";
import dislikeImgUrl from "src/assets/dislike.png";
import 'src/style/card.scss'

import UserRequest from "../../../global/api/user";
import { useGesture } from "react-with-gesture";
import { NAVS, TITLES } from "../../../global/utils";

const year = parseInt(new Date().getFullYear());
const to = (i) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
// const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: 0 });
const trans = (r, s) =>`perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rot0ateZ(${r}deg) scale(${s})`;

  

function Deck2({socket, chatCon, homeCon, user}) {
  // console.log(homeCon.state)
  // const [fetchedAll, hasFetchedAll] = useState(false);
  // const removedPersonFromDataSrc = (peopleSource, userId) =>
  //   peopleSource.filter((info) => info._id !== userId);

  const handleLike = async (id, info, type) => {

    let data = await UserRequest.handleLike(id, type)

    // remove
    let newList = homeCon.state.cards.slice(0, homeCon.state.cards.length-1)
    homeCon.saveCards(newList)
    console.log(socket)
    if (data.match) {
      socket.emit('match', {_id: user._id, info: user.info}, {_id: id, info: info}) // emit for that person
      console.log('yayyy matched with ' + info.name) 
    }
    if (homeCon.state.cards.length == 1) {
      fetchImage();
    }
  };

  const fetchImage = async () => {
    console.log('start fetching')
    try {
      let data = await UserRequest.getCards(1)
      if (data.length) {
        homeCon.saveCards(data.reverse())
        setTimeout(() => {gone.clear() || set((i) => to(i))}, 600)
      } else {
        console.log('out of cards :(')
        homeCon.selectEmptyScreen()
      }
    } catch (err) {
      console.log(err)
    }
  };

  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(homeCon.state.cards.length, (i) => ({
      ...to(i),
      from: from(i),
    })); 

  const bind = useGesture(
    ({
      args: [index, _id, info],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity,
    }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit

        if (isGone) {
          if (dir > 0) {
            handleLike(_id, info, 'like')
          } else {
            handleLike(_id, info, 'unlike')
          }
        }

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
      
    }
  );
  
  let infos = homeCon.state.cards

  return (<div id="main-deck">
  <div id="cards-stack">
  {props.map(({ x, y, rot, scale }, i) => {
    return (
      <animated.div
        key={i}
        className="card-container"
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          ),
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
        <animated.div
          {...bind(i, infos[i]._id, infos[i].info)}
          className="card"
          style={{
            transform: interpolate([rot, scale], trans),
            backgroundImage: `url(${infos[i].info.imgUrl})`,
          }}
        >
          <div className="card-info">
            <div className="big-info">
              {infos[i].info.name}{" "}
              {year - parseInt(infos[i].info.birthdate.substring(0, 4))}
              <ion-icon
                name={infos[i].info.gender}
                style={{ position: "relative", bottom: -2, marginLeft: 5 }}
              ></ion-icon>
            </div>
            <div className="small-info">{infos[i].info.desc}</div>
          </div>
        </animated.div>
      </animated.div>
      
    )})}</div>
    <div id="instruction">
      <div id="action-buttons">
        {infos.length ? [{ value: 'unlike', imgUrl: dislikeImgUrl }, { value: 'like', imgUrl: likeImgUrl }, ].map(el => (
          <button 
            className="action-button"
            onClick={() => { handleLike(infos[infos.length-1]._id, infos[infos.length-1].info, el.value); }}>
            <img src={el.imgUrl} alt={el.value} style={{ height: 35, width: 35 }} />
          </button>
        )) : <div></div>}
      </div>
      <div id="instruction-text">Swipe left: ❌ and Swipe right: 💖</div>
    </div>
  </div>)
}

export default Deck2;