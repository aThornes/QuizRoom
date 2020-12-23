import React, {useState, useEffect} from 'react';

function RoomFooter(props) {  

  let [clicked, setClicked] = useState(false);

  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");

  let [showErr, setShowErr] = useState(false);

  let [totalPlayers, setTotalPlayers] = useState(0);
  let [readyPlayers, setReadyPlayers] = useState(0);

  useEffect(() => {
    setTotalPlayers(Object.keys(props.roomData.JoinedUsers).length);

    let numPlayersCompleted = 0;

    let roundNum = props.roomData.RoundNum;
    let questionNum = props.roomData.QuestionNum;

    if(questionNum >= 100) questionNum -= 100;

    Object.keys(props.roomData.JoinedUsers).forEach(p => {
      const user = props.roomData.JoinedUsers[p];
      if(user.answers){
        Object.keys(user.answers).forEach(ansKey => {
          const ans = user.answers[ansKey];
          if(ans.q === questionNum && ans.rnd === roundNum && (ans.correct === true || ans.correct === false) ){
            numPlayersCompleted++;
          }
        });
      }
    });
    
    setReadyPlayers(numPlayersCompleted);

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData.JoinedUsers, props.roomData.RoundNum, props.roomData.QuestionNum])

  const getStageOption = () => {
    if(props.roomData.Stage === 0){
      return <button onClick={() => props.updateRoomData("Stage", 1)}>Start quiz!</button>
    } else if(props.roomData.Stage === 1){
      return (<>
        <button onClick={() => props.updateRoomData("Stage", 0)}>Back to setup</button>
        <button onClick={() => props.updateRoomData("Stage", 2)}>End quiz</button>
      </>)
    } else {
      return (<>
        <button onClick={() => props.updateRoomData("Stage", 0)}>Back to setup</button>
        <button onClick={() => props.updateRoomData("Stage", 1)}>Back to questions</button>
      </>)
    }
  }

  const changeRound = (newVal) => {
    props.updateRoomData("RoundNum", newVal);
    props.updateRoomData("QuestionNum", -1)
  }

  const getQuestionOptions = () => {
    const roundNum = props.roomData.RoundNum;
    const questionNum = props.roomData.QuestionNum;
    const questionSet = props.questionData[props.roomData.Questions[roundNum].id];

    const upperQuestionBound = (props.roomData.Questions[roundNum].limit === -1) ? Object.keys(questionSet).length - 3 : props.roomData.Questions[roundNum].limit;

    if(props.roomData.Stage === 1){
      let nextRound, prevRound, nextQues, prevQues = false;
      if(roundNum < Object.keys(props.roomData.Questions).length - 1) nextRound = true;
      
      if(roundNum > 0) prevRound=true;

      if((questionNum < upperQuestionBound && questionNum < 100) || (questionNum >= 100 && questionNum < (100 + upperQuestionBound)))  nextQues = true;

      if((questionNum >= 0 && questionNum < 100) || questionNum > 100) prevQues = true;

      return(<>
        <button className="footerArrow" disabled={!prevRound} onClick={() => changeRound(roundNum-1)}>&lt;</button>
        <div className="footerText">Round</div>
        <button className="footerArrow" disabled={!nextRound} onClick={() => changeRound(roundNum+1)}>&gt;</button>
        <button className="footerArrow" disabled={!prevQues} onClick={() => props.updateRoomData("QuestionNum", questionNum - 1)}>&lt;</button>
        <div className="footerText">Question</div>
        <button className="footerArrow" disabled={!nextQues} onClick={() => props.updateRoomData("QuestionNum", questionNum + 1)}>&gt;</button>

        { questionNum < 99 ? <button onClick={() => props.updateRoomData("QuestionNum", 100)}>Answers</button> :
        (questionNum >= 100) ? 
        <button onClick={() => props.updateRoomData("QuestionNum", 99)}>Summary</button> :
        <button onClick={() => props.updateRoomData("QuestionNum", upperQuestionBound)}>Questions</button>
        }
      </>);      

    } else return (<> </>);
  }
  
  const getOptions = () => {
    return(
      <>
        <div id="footerOptions">
            {getQuestionOptions()}
            {getStageOption()}
            {props.roomData.QuestionNum >= 100 ? <div>{readyPlayers}/{totalPlayers}</div> : <> </>}
        </div>
        <div id="footerManage">
          <button onClick={() => setClicked(clicked === true ? false : true)}>Return</button>
          <button onClick={() => props.authLogout()}>Log out</button>
        </div>
      </>
    );
  }

  const logUser = (e) => {
    e.preventDefault();

    props.authLogin(user,pass);

    setShowErr(true); //Can just set error to show, if login works then user will not see login option anymore anyway
  }

  const getLogin = () => {
    return(
        <div>
            <form onSubmit={(e) => logUser(e)}>
                <input type="text" name="username" value={user} onChange={(e) => {setUser(e.target.value)}} />
                <input type="password" name="password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
                <button>Go</button>
            </form>
            {showErr ? <div>*Invalid credentials</div> : <></>}
        </div>   
    );
  }


  if(props.isAdmin || props.auth){
    return (
        <div id="roomFooter">          
          {clicked ? 
          <div id="roomManageContainer">
              {props.auth ? getOptions() : getLogin()}
          </div> : 
          <div id="roomManageContainer">
              <button onClick={() => setClicked(clicked === true ? false : true)}>Manage</button>
          </div>}
        </div>
      );
  } else {
      return(<> </>);
  }
  
}

export default RoomFooter;
