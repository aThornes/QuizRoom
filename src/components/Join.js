import React, { useState } from 'react';

import "../assets/css/animation.scss";
import "../assets/css/join.css";

import githubImage from "../assets/github.png"

// import text1 from '../assets/textNanGs.png';
// import text2 from '../assets/textBig.png';
// import text3 from '../assets/textBirthdayQuiz.png';
// import textRoom from '../assets/textRoomCode.png';

const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Join(props) {  

  let [roomCode, setRoomCode] = useState('');
  let [showError, setShowError] = useState('');

  const snowArray = Array(199).fill(1);

  const submitRoomCode = (e) => {
    e.preventDefault();

    if(roomCode.length !== 5) setShowError(true);
    else {
      setShowError(false);

      props.history.push(`/room/${roomCode}`);
      window.location.reload();
    }
  }

  const updateRoomCode = (e) => {
    if(e.target.value.length <= 5)
      setRoomCode(e.target.value.toUpperCase());
  }

  let d = new Date();
  let m = d.getMonth();



  return (
    <div id="snowy">
      {snowArray.map((a, idx) => {
        return <div className="snow" key={idx}/>
      })}
      <div id="roomFlex">
      <div className="joinText" id="joinText1">
        <span>The</span>
        {/* <span id="textSmall">s</span> */}
      </div>
      <div className="joinText" id="joinText2">Big</div>
      <div className="joinText" id="joinText3">{monthList[m]} Quiz</div>
      <div className="joinText" id="joinTextRoom">Room Code</div>

          {/* <img id="joinText1" src={text1} alt="Nan G's"/>
          <img id="joinText2" src={text2} alt="Big"/>
          <img id="joinText3" src={text3} alt="Birthday Quiz"/>
          <img id="joinTextRoom" src={textRoom} alt="Room Code" /> */}
          <form id="joinSubmitForm" onSubmit={(e) => submitRoomCode(e)}>
            <input id="codeInput" type="text" name="roomCode" value={roomCode} onChange={(e) => {updateRoomCode(e)}}></input>
            <div>
              {showError ? <label>*Invalid code*</label> : <label></label>}
            </div>
            <div>
              <button>Join</button>
            </div>
          </form>
          
      </div>
      <img id="githubLink" src={githubImage} alt="Github" onClick={() => window.open("https://github.com/aThornes/QuizRoom")}></img>
    </div>
  );
}

export default Join;
