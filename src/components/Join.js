import React, { useState } from 'react';

import "../assets/css/animation.scss";
import "../assets/css/join.css";

// import text1 from '../assets/textNanGs.png';
// import text2 from '../assets/textBig.png';
// import text3 from '../assets/textBirthdayQuiz.png';
// import textRoom from '../assets/textRoomCode.png';

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
      <div className="joinText" id="joinText1"><span>NAN G</span><span id="textSmall"> s</span></div>
      <div className="joinText" id="joinText2">Big</div>
      <div className="joinText" id="joinText3">Birthday Quiz</div>
      <div className="joinText" id="joinTextRoom">Room Code</div>

          {/* <img id="joinText1" src={text1} alt="Nan G's"/>
          <img id="joinText2" src={text2} alt="Big"/>
          <img id="joinText3" src={text3} alt="Birthday Quiz"/>
          <img id="joinTextRoom" src={textRoom} alt="Room Code" /> */}
          <form onSubmit={(e) => submitRoomCode(e)}>
            <input id="codeInput" type="text" name="roomCode" value={roomCode} onChange={(e) => {updateRoomCode(e)}}></input>
          </form>
          
      </div>
    </div>
  );
}

export default Join;
