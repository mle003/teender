import React, { useState, useEffect } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import axios from "axios";
import like from "../../../assets/like.png";
import dislike from "../../../assets/dislike.png";
import superlike from "../../../assets/superlike.png";
import rewind from "../../../assets/rewind.png";

const year = parseInt(new Date().getFullYear());
const to = (i) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r, s) =>
  `perspective(1500px) rotateX(0deg) rotateY(${
    r / 10
  }deg) rot0ateZ(${r}deg) scale(${s})`;
let check = true;

function Deck2() {
  const [infos, setInfos] = useState([]);
  const [props, set] = useSprings(infos.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  const removedPersonFromDataSrc = (peopleSource, userId) =>
    peopleSource.filter((info) => info._id !== userId);

  const handleLike = (id, type) => {
    axios
      .request({
        url: "http://localhost:9000/api/like-unlike",
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
        },
        data: {
          id: id,
          status: type,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleUnLike = (id, type) => {
    axios
      .request({
        url: "http://localhost:9000/api/like-unlike",
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
        },
        data: {
          id: id,
          status: type,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const fetchImage = () => {
    axios
      .request({
        url: "http://localhost:9000/api/cards",
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (check) {
          let data = res.data.data;
          setInfos(data);
          check = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchMorePeople = () => {
    axios
      .request({
        url: "http://localhost:9000/api/cards",
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        let data = res.data.data;
        setInfos(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (infos.length === 0) {
      fetchImage();
    }
    if (infos.length === 1) {
      fetchMorePeople();
    }
  }, [infos]);

  return props.map(({ x, y, rot, scale }, i) => (
    <div
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
      <div
        id="action-button"
        style={{ width: 362, justifyContent: "space-between" }}
      >
        <button
          className="action-button"
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onClick={() => {
            setInfos(removedPersonFromDataSrc(infos, infos[i]._id));
            handleLike(infos[i]._id, "like");
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
            handleUnLike(infos[i]._id, "unlike");
          }}
        >
          <img
            src={dislike}
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
        </button>
      </div>
    </div>
  ));
}

export default Deck2;
