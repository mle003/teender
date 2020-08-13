import React, { useState, useEffect } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-with-gesture";
import axios from "axios";

const year = parseInt(new Date().getFullYear());

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
// const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })

const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(0deg) rotateY(${
    r / 10
  }deg) rot0ateZ(${r}deg) scale(${s})`;
// const trans = (r, s) => `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
let check = true;

function Deck() {
  const [infos, setInfos] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (infos.length === 0) {
      axios
        .request({
          url: "http://localhost:9000/api/cards",
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
          },
          params: {
            pageIndex: count,
          },
        })
        .then((res) => {
          if (check) {
            // console.log(res.data.data[0].info.imgUrl);
            let data = res.data.data;
            console.log("data", res.data);
            // console.log(JSON.stringify(data[0]));
            setInfos(data);
            check = false;
          }
        })
        .catch((err) => {
          console.log(err);
          // console.log(err.response.data.message);
        });
    } else {
      console.log("123456");
    }
  });
  console.log("908", infos);
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(infos.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity,
    }) => {
      console.log(infos);
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
          console.log(i);
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
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      key={i}
      className="card-container"
      style={{
        transform: interpolate(
          [x, y],
          (x, y) => `translate3d(${x}px,${y}px,0)`
        ),
      }}
    >
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div
        {...bind(i)}
        // {...removeUsers(i)}
        onDoubleClick={(e) => clickInfo(e)}
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
    </animated.div>
  ));
}
function clickInfo(x) {
  console.log(x);
}
export default Deck;
