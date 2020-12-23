import React, { useState } from 'react';

import "../assets/css/animation.scss";
import "../assets/css/join.css";

function Join(props) {  

  let [roomCode, setRoomCode] = useState('');

  const snowArray = Array(199).fill(1);

  const submitRoomCode = (e) => {
    e.preventDefault();

    props.history.push(`/room/${roomCode}`);
  }

  const updateRoomCode = (e) => {
    if(e.target.value.length <= 5)
      setRoomCode(e.target.value.toUpperCase());
  }

  return (
    <div id="snowy">
      {snowArray.map((a, idx) => {
        return <div className="snow" key={idx}/>
      })}
      <div id="roomFlex">
          <div id="title">Quizzicle</div>
          <div id="roomCode">Room code</div>
          <form onSubmit={(e) => submitRoomCode(e)}>
            <input id="codeInput" type="text" name="roomCode" value={roomCode} onChange={(e) => {updateRoomCode(e)}}></input>
          </form>
          
      </div>
    </div>
  );
}

export default Join;
