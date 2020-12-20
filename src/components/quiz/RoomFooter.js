import React, {useState} from 'react';

function RoomFooter(props) {  

  let [clicked, setClicked] = useState(false);

  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");

  let [showErr, setShowErr] = useState(false);

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


  const getQuestionOptions = () => {
    const roundNum = props.roomData.RoundNum;
    const questionNum = props.roomData.QuestionNum;
    const questionSet = props.questionData[props.roomData.Questions[roundNum].id];

    const upperQuestionBound = (props.roomData.Questions[roundNum].limit === -1) ? Object.keys(questionSet).length - 3 : props.roomData.Questions[roundNum].limit;

    if(props.roomData.Stage === 1){
      let nextRound, prevRound, nextQues, prevQues = false;
      if(roundNum < Object.keys(props.roomData.Questions).length - 1) nextRound = true;
      
      if(roundNum > 0) prevRound=true;

      if(questionNum < upperQuestionBound)  nextQues = true;

      if(questionNum > 0) prevQues = true;

      return(<>
        <button disabled={!prevRound} onClick={() => props.updateRoomData("RoundNum", roundNum - 1)}>Previous Round</button>
        <button disabled={!nextRound} onClick={() => props.updateRoomData("RoundNum", roundNum + 1)}>Next Round</button>
        <button disabled={!prevQues} onClick={() => props.updateRoomData("QuestionNum", questionNum - 1)}>Previous Question</button>
        <button disabled={!nextQues} onClick={() => props.updateRoomData("QuestionNum", questionNum + 1)}>Next Question</button>
      </>);
      

    } else return (<> </>);
  }
  
  const getOptions = () => {
    return(
        <div>
            {getQuestionOptions()}
            {getStageOption()}
            <button onClick={() => props.authLogout()}>Log out</button>
        </div>
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
        <>
        <div>
            <button onClick={() => setClicked(clicked === true ? false : true)}>Manage</button>
        </div>
        {clicked ? 
        <div>
            {props.auth ? getOptions() : getLogin()}
        </div> : <> </>}
        </>
      );
  } else {
      return(<> </>);
  }
  
}

export default RoomFooter;
