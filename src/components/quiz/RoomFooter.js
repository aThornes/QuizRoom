import React, {useState, useEffect} from 'react';

import configImage from "../../assets/config.png"

function RoomFooter(props) {  

  let [clicked, setClicked] = useState(false);

  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");

  let [showErr, setShowErr] = useState(false);

  let [totalPlayers, setTotalPlayers] = useState(0);
  let [readyPlayers, setReadyPlayers] = useState(0);

  let [autoProgress, setAutoProgress] = useState(false);

  useEffect(() => {
    setTotalPlayers(Object.keys(props.roomData.JoinedUsers).length);

    let numPlayersCompleted = 0;
    let answeredPlayers = 0;

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
          if(ans.q === questionNum && ans.rnd === roundNum && (ans.val !== undefined && ans.val !== null)){
            answeredPlayers++;
          }
        });
      }
    });
    
    setReadyPlayers(numPlayersCompleted);

    if(!props.auth) return;

    questionNum = props.roomData.QuestionNum;

    /* If required, auto-progress round when all users have answered */
    if(autoProgress && props.roomData.Stage === 1 && props.roomData.QuestionNum !== 99){
      const questionSet = props.questionData[props.roomData.Questions[roundNum].id];  
      const upperQuestionBound = (props.roomData.Questions[roundNum].limit === -1) ? Object.keys(questionSet).length - 3 : props.roomData.Questions[roundNum].limit;

      let nextQues = false;

      if((questionNum < upperQuestionBound && questionNum < 99) || (questionNum >= 100 && questionNum < (100 + upperQuestionBound)))  nextQues = true;

      if(nextQues && ((questionNum < 99 && answeredPlayers === Object.keys(props.roomData.JoinedUsers).length) || (questionNum >= 100 && numPlayersCompleted === Object.keys(props.roomData.JoinedUsers).length))){
        props.updateRoomData("QuestionNum", questionNum + 1);
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData.JoinedUsers, props.roomData.RoundNum, props.roomData.QuestionNum, autoProgress])

  const getStageOption = () => {
    if(props.roomData.Stage === 0){
      return <><div id="modalSpaceDown"></div><div><button onClick={() => props.updateRoomData("Stage", 1)}>Start quiz!</button></div></>
    } else if(props.roomData.Stage === 1){
      return (<>
        <div id="modalStageButtons">
          <button onClick={() => props.updateRoomData("Stage", 0)}>Setup</button>
          <button onClick={() => props.updateRoomData("Stage", 2)}>Finale</button>
        </div>
        <div className="modalProgressOption">
          <button onClick={() => setAutoProgress(!autoProgress ? true : false)} >{!autoProgress ? "Auto-Progress" : "Manual-Progress"}</button>
        </div>
      </>)
    } else {
      return (<>
        <div id="modalSpaceDown"></div>
        <div id="modalStageButtons">
          <button onClick={() => props.updateRoomData("Stage", 0)}>Setup</button>
          <button onClick={() => props.updateRoomData("Stage", 1)}>Questions</button>
        </div>
        <div className="modalProgressOption">
          <button onClick={() => setAutoProgress(!autoProgress ? true : false)} >{!autoProgress ? "Auto-Progress" : "Manual-Progress"}</button>
        </div>
      </>)
    }
  }

  const changeRound = (newVal, res) => {
    props.updateRoomData("RoundNum", newVal);
    if(props.roomData.QuestionNum !== 99 || res)
      props.updateRoomData("QuestionNum", -1)
  }

  const changeQuestion = (newVal) => {
    if(newVal < props.roomData.QuestionNum) setAutoProgress(false); //Stop auto-progression when going back to previous question
    props.updateRoomData("QuestionNum", newVal)
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

      if((questionNum < upperQuestionBound && questionNum < 99) || (questionNum >= 100 && questionNum < (100 + upperQuestionBound)))  nextQues = true;

      if((questionNum >= 0 && questionNum < 99) || questionNum > 100) prevQues = true;

      return(<div id="modalRoundAdmin">
        <div className="modalRoundSegment">
          <div><button className="modalPointerButton" disabled={!prevRound} onClick={() => changeRound(roundNum-1)}>&lt;</button></div>
          <div>Round</div>
          <div><button className="modalPointerButton"  disabled={!nextRound} onClick={() => changeRound(roundNum+1)}>&gt;</button></div>
        </div>
        <div className="modalRoundSegment">
          <button className="modalPointerButton"  disabled={!prevQues || props.roomData.QuestionNum === 99} onClick={() => changeQuestion(questionNum - 1)}>&lt;</button>
          <div>Question</div>
          <button className="modalPointerButton"  disabled={!nextQues || props.roomData.QuestionNum === 99} onClick={() => changeQuestion(questionNum + 1)}>&gt;</button>
        </div>
        
        <div>{ questionNum < 99 ? <button onClick={() => props.updateRoomData("QuestionNum", 100)}>Answers</button> :
        (questionNum >= 100) ? 
        <button onClick={() => props.updateRoomData("QuestionNum", 99)}>Summary</button> :
        <button onClick={() => props.updateRoomData("QuestionNum", upperQuestionBound)}>Questions</button>
        }</div>
      </div>);      

    } else return (<> </>);
  }
  
  const getOptions = () => {
    return(
      <div id="modalOptions">
        <div id="modalOptionChoice">
            {getQuestionOptions()}
            {getStageOption()}
            {props.roomData.QuestionNum >= 100 ? <div>{readyPlayers}/{totalPlayers}</div> : <> </>}
        </div>
        <div id="modalFooter">
          <button className="modalButton" onClick={() => setClicked(clicked === true ? false : true)}>Return</button>
          <button className="modalButton" onClick={() => props.authLogout()}>Log out</button>
        </div>
      </div>
    );
  }

  const startQuestionRound = (isAuto) => {
    if(isAuto){
      setAutoProgress(true);
    }
    
    changeQuestion(0);
    
  }

  const getProgressButton = () => {
    const roundNum = props.roomData.RoundNum;
    const questionNum = props.roomData.QuestionNum;
    const questionSet = props.questionData[props.roomData.Questions[roundNum].id];

    const upperQuestionBound = (props.roomData.Questions[roundNum].limit === -1) ? Object.keys(questionSet).length - 3 : props.roomData.Questions[roundNum].limit;

    if(props.roomData.Stage === 0){
      return(<button className="modalButton" onClick={() => props.updateRoomData("Stage", 1)}>Start!</button>)      
    } else if(questionNum === upperQuestionBound){
      return(<div className="progressAbs"><button onClick={() => props.updateRoomData("QuestionNum", 100)}>A</button></div>)
    } else if(questionNum === (upperQuestionBound + 100)){
      return(<div className="progressAbs"><button onClick={() => props.updateRoomData("QuestionNum", 99)}>S</button></div>)
    } else if(questionNum === 99 && roundNum < Object.keys(props.roomData.Questions).length){
      return(<div className="progressAbs"><button onClick={() => changeRound(roundNum+1, true)}>N</button></div>)
    } else if(props.roomData.QuestionNum === -1){
      return(<div className="modalProgressOption">
        <button className="modalButton" onClick={() => startQuestionRound()}>Begin (Manual)</button>
        <button className="modalButton" onClick={() => startQuestionRound(true)}>Begin (Auto)</button>
      </div>);
    }
    return(<></>);
  }

  const logUser = async(e) => {
    e.preventDefault();

    const success = await props.authLogin(user,pass);

    if(!success)
      setShowErr(true);
  }

  const getLogin = () => {
    return(
        <div>
            <form id="adminLogin" onSubmit={(e) => logUser(e)}>
              <div>
                <input type="text" name="username" value={user} onChange={(e) => {setUser(e.target.value)}} />
              </div>
              <div>
                <input type="password" name="password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
              </div>
              <div>
                <button>Go</button>
              </div>      
              <div>
                <button onClick={() => setClicked(false)}>Back</button>
              </div>              
            </form>
            {showErr ? <div>*Invalid credentials</div> : <></>}
        </div>   
    );
  }


  if(props.isAdmin || props.auth){
    return (
        <div>
          {clicked ? 
          <>
          <div id="screenDim"></div>
          <div id="adminModal">
            <div id="modalHeader">Admin Controls</div>
            <div id="modalContent">{props.auth ? getOptions() : getLogin()}</div>              
          </div>
          </> : 
          <>
          {props.auth ? <div>
            {getProgressButton()}
          </div> : <> 
          </>}
          <div>
              <img id="adminOptionImage" src={configImage} alt="configuration" onClick={() => setClicked(clicked === true ? false : true)} />
          </div>
          </>}
        </div>
      );
  } else {
      return(<> </>);
  }
  
}

export default RoomFooter;
