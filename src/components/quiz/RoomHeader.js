import React, {useState, useEffect} from 'react';

import userCompletedImage from '../../assets/userCompleted.png'

function RoomHeader(props) {  

  let [clicked, setClicked] = useState(false);

  let [totalPlayers, setTotalPlayers] = useState(0);
  let [readyPlayers, setReadyPlayers] = useState(0);

  useEffect(() => {
    setTotalPlayers(Object.keys(props.roomData.JoinedUsers).length);

    let numPlayersCompleted = 0;

    let roundNum = props.roomData.RoundNum;
    let questionNum = props.roomData.QuestionNum;

    Object.keys(props.roomData.JoinedUsers).forEach((p, idx) => {
      const user = props.roomData.JoinedUsers[p];
      if(user.answers){
        
        Object.keys(user.answers).forEach(ansKey => {
          const ans = user.answers[ansKey];
          if(ans.q === questionNum && ans.rnd === roundNum && (ans.val !== undefined && ans.val !== null)){
            numPlayersCompleted++;
          }
        });
      }
    });
    
    setReadyPlayers(numPlayersCompleted);

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData.JoinedUsers, props.roomData.RoundNum, props.roomData.QuestionNum]);

  const getCompleteIcons = () => {
    let progressList = [];

    for(let i = 0; i < totalPlayers; i++){
      if(readyPlayers >= (i+1)) progressList.push(1);
      else progressList.push(0);
    }
    
    return progressList.map((v, idx) => {
      if(v === 1)
        return <img className={`progressIcon progressReady`} key={idx} src={userCompletedImage} alt="userReady" />
      else
        return <img className={`progressIcon progressWaiting`}  key={idx} src={userCompletedImage} alt="userReady" />
    });
  }
 
  return (
    <div id="roomHeaderContainer">
      <div id="roomHeaderProgress">
        {props.showProgress ? getCompleteIcons() : <></>}
      </div>
      <div id="roomHeader">
        <div id="headerContainer">
        <div onClick={() => setClicked(clicked === true ? false : true)}>
            <div>Room Code</div>
            <div>{props.roomCode}</div>          
        </div>
        {clicked ? <div id="leaveButton" onClick={() => props.leaveRoom()}>Leave Room</div> : <> </>}
        </div>
      </div>
    </div>
  );
}

export default RoomHeader;
