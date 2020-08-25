import React, { useState, useEffect } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-with-gesture";
import like from "src/assets/like.png";
import dislike from "src/assets/dislike.png";
import axios from "axios";
import UserRequest from "../../../global/api/user";
import "src/style/card.scss";

const year = parseInt(new Date().getFullYear());
const to = (i) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
// const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })

const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r, s) =>
  `perspective(1500px) rotateX(0deg) rotateY(${
    r / 10
  }deg) rot0ateZ(${r}deg) scale(${s})`;
// const trans = (r, s) => `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
let firstTimeLoad = true;

const removedPersonFromDataSrc = (peopleSource, userId) =>
  peopleSource.filter((info) => info._id !== userId);

const getCards = async (infos, page) => {
  try {
    let data = await UserRequest.getCards(page);
    let newData = [...infos, data];
    return newData;
  } catch (err) {
    console.error(err);
    return [];
  }
};

function Deck() {
  const [infos, setInfos] = useState([]);
  const [count, setCount] = useState(1);
  const removedPersonFromDataSrc = (peopleSource, userId) =>
    peopleSource.filter((info) => info._id !== userId);

  useEffect(() => {
    console.log("use effect");
    if (infos.length === 0) {
      const getNewCards = async () => {
        try {
          let data = await UserRequest.getCards(count);
          console.log(data);
          setInfos(data);
        } catch (err) {
          console.error(err);
        }
      };
      getNewCards(count);
    } else console.log("infos has length");
  });
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(infos.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity

  const bind = useGesture(
    ({
      args: [index, info],
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
            console.log("like");
          } else {
            console.log("unlike");
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
      if (!down && gone.size === infos.length)
        setTimeout(() => gone.clear() || set((i) => to(i)), 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => {
    console.log("render infos list");
    console.log(infos);
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
        <animated.div
          // {...bind(i)}
          onDoubleClick={(e) => clickInfo(e)}
          className="card"
          style={{
            // transform: interpolate([rot, scale], trans),
            backgroundImage: `url(${infos[i].info.imgUrl})`,
          }}
        >
          <div className="card-info">
            <div className="big-info">
              {infos[i].info.name}{" "}
              {year - parseInt(infos[i].info.birthdate.substring(0, 4))}
              {infos[i].info.gender === "male" ? (
                <ion-icon
                  name="male"
                  style={{ position: "relative", bottom: -2, marginLeft: 5 }}
                ></ion-icon>
              ) : (
                <ion-icon
                  name="female"
                  style={{ position: "relative", bottom: -2, marginLeft: 5 }}
                ></ion-icon>
              )}
              <ion-icon
                onClick={(e) => clickInfo(e)}
                name="information-circle"
                class="info-icon"
                style={{ position: "relative", bottom: -2.5, marginLeft: 5 }}
              ></ion-icon>
            </div>
            <div className="small-info">{infos[i].info.desc}</div>
          </div>
        </animated.div>
        <div
          id="action-button"
          style={{ width: 362, justifyContent: "space-between" }}
        >
          <button
            className="action-button"
            style={{
              height: 50,
              width: 50,
              marginLeft: 100,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            onClick={() => {
              setInfos(removedPersonFromDataSrc(infos, infos[i]._id));
              UserRequest.handleLike(infos[i]._id, "like");
              console.log(infos);
            }}
          >
            <img
              src={like}
              alt="like"
              style={{ height: 35, width: 35, flex: 1 }}
            />
          </button>
          <button
            className="action-button"
            style={{
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft: 54,
            }}
            onClick={() => {
              setInfos(removedPersonFromDataSrc(infos, infos[i]._id));
              UserRequest.handleLike(infos[i]._id, "unlike");
            }}
          >
            <img
              src={dislike}
              alt="like"
              style={{ height: 35, width: 35, flex: 1 }}
            />
          </button>
          {/* <button
          className="action-button"
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "flex-start",
            marginLeft: 54,
          }}
          onClick={() => {
            setInfos(removedPersonFromDataSrc(infos, infos[i]._id));
          }}
        >
          <img
            src={superlike}
            alt="like"
            style={{ height: 35, width: 35, flex: 1 }}
          />
        </button>
        <button
          className="action-button"
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "flex-start",
            marginLeft: 54,
          }}
          onClick={() => {
            setInfos(removedPersonFromDataSrc(infos, infos[i]._id));
          }}
        >
          <img
            src={rewind}
            alt="like"
            style={{ height: 35, width: 35, flex: 1 }}
          />
        </button> */}
        </div>
      </animated.div>
    );
  });
}
function clickInfo(x) {
  console.log(x);
}
export default Deck;
