import React, {useState, useEffect} from 'react';

import userCompletedImage from '../../assets/mom.png'

function RoomHeader(props) {  

  let [clicked, setClicked] = useState(false);

  let [playerObjs, setPlayerObjs] = useState([]);

  useEffect(() => {
    let roundNum = props.roomData.RoundNum;
    let questionNum = props.roomData.QuestionNum;

    let userObjects = [];

    Object.keys(props.roomData.JoinedUsers).forEach((p) => {
      const user = props.roomData.JoinedUsers[p];
      userObjects.push({name: user.name, image: null, answer: false}); //possibility of custom images here but cba for now

      if(user.answers){
        const answerKeys = Object.keys(user.answers);

        for(let i = 0; i < answerKeys.length; i++){
          const ans = user.answers[answerKeys[i]];
          if(ans.q === questionNum && ans.rnd === roundNum && (ans.val !== undefined && ans.val !== null)){
            userObjects[userObjects.length - 1].answer = true;
            break;
          }
        }       
      }
    });

    setPlayerObjs(userObjects);

    //setPlayerObjs([{name:"12345678", answer:true},{name:"12345678", answer:false},{name:"12345678", answer:false},{name:"12345678", answer:true},{name:"12345678", answer:true},{name:"12345678", answer:false},{name:"12345678", answer:false}]);

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData.JoinedUsers, props.roomData.RoundNum, props.roomData.QuestionNum]);

  const getCompleteIcons = () => {    
    const useSmall = playerObjs.length > 6;
    return <div id="userCompletedListContainer" className={useSmall ? "listCompleteSmall" : ""}>{playerObjs.map((v, idx) => {
      return <div><img className={`progressIcon ${v.answer === true ? "progressReady" : "progressWaiting"}`} key={idx} src={v.image || userCompletedImage} alt="userReady" /><div>{v.name.length < 8 ? v.name : `${v.name.substring(0,6)}..`}</div></div>     
    })}</div>
  }

  const showQuestionNumHeader = () => {
    console.log(props.roomData);
    const display = (props.roomData.Stage === 1 && props.roomData.QuestionNum >= 0 && props.roomData.QuestionNum !== 99);

    if(display){
      return (
        <div id="roomHeaderQuestionNum">
          <div>Q{props.roomData.questionNum >= 100 ? `${(props.roomData.QuestionNum - 100) + 1}` : `${props.roomData.QuestionNum + 1}`}</div>
        </div>
        );
    }
    else return <> </>
  }
 
  return (
    <>
    {showQuestionNumHeader()}
    <div id="roomHeaderContainer">
      <div id="roomHeaderProgress">
        {props.showProgress ? getCompleteIcons() : <></>}
      </div>
      {props.showCode ? 
      <div id="roomHeader">
        <div id="headerContainer">
        <div onClick={() => setClicked(clicked === true ? false : true)}>
            <div>Room Code</div>
            <div>{props.roomCode}</div>          
        </div>
        {clicked ? <div id="leaveButton" onClick={() => props.leaveRoom()}>Leave Room</div> : <> </>}
        </div>
      </div>
      :<></>}
    </div>
    </>
  );
}

export default RoomHeader;
