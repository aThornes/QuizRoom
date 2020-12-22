import React, {useState, useEffect} from 'react';

function RoomHeader(props) {  

  let [clicked, setClicked] = useState(false);

  let [totalPlayers, setTotalPlayers] = useState(0);
  let [readyPlayers, setReadyPlayers] = useState(0);

  useEffect(() => {
    setTotalPlayers(Object.keys(props.roomData.JoinedUsers).length);

    let numPlayersCompleted = 0;

    let roundNum = props.roomData.RoundNum;
    let questionNum = props.roomData.QuestionNum;

    Object.keys(props.roomData.JoinedUsers).forEach(p => {
      const user = props.roomData.JoinedUsers[p]
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
  }, [props.roomData.JoinedUsers, props.roomData.RoundNum, props.roomData.QuestionNum])
 

  return (
    <>
    <div>{readyPlayers}/{totalPlayers}</div>
    <div onClick={() => setClicked(clicked === true ? false : true)}>
        <div>Room Code</div>
        <div>{props.roomCode}</div>
        {clicked ? <div>Back</div> : <> </>}
    </div>
    <div>Logged in as: {props.loggedName}</div>
    </>
  );
}

export default RoomHeader;
