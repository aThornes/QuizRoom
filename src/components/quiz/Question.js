import React, {useState} from 'react';

import Music from './Music';
import Picture from './Picture';
import Generic from './Generic';
import Choice from './Choice';
import Answers from './Answers';


function Question(props) {  

  const [userDone, setUserDone] = useState(false);

  //TODO
  const allowInput = true;

  
  let roundNum = props.roomData.RoundNum;
  let questionNum = props.roomData.QuestionNum;
  let questionSetID = props.roomData.Questions[roundNum].id;
  let type = props.questionData[questionSetID].type;
  let headerText = props.questionData[questionSetID].text;
  
  let ans = null;

  
  if(questionNum >= 100){
    type="answer";
    questionNum -= 100;
  } 

  if(props.userData && props.userData.answers){
    ans = props.userData.answers.find(val => val.rnd === roundNum && val.q === questionNum);
  }


  const getUserIndex = () => {
    let userIndex = -1;
    let objKeys = Object.keys(props.roomData.JoinedUsers);
    for(let i = 0; i < objKeys.length; i++){
      if(props.roomData.JoinedUsers[objKeys[i]].name === props.userData.name) {userIndex = i; break;} 
    }
    return userIndex;
  }  

  const getAnswerIndex = (userIndex) => {
    let objKeys = [];
    let ansIndex = -1;
    const answers = props.roomData.JoinedUsers[userIndex].answers;  
    if(answers){
      objKeys = Object.keys(answers);
      for(let i = 0; i < objKeys.length; i++){
        if(answers[objKeys[i]].q === questionNum && answers[objKeys[i]].rnd === roundNum) {ansIndex = i; break;} 
      }
    }

    return {idx: ansIndex, len: objKeys.length};
  }

  const setAsDone = (value, revert) => {
    /* Mark user has 'completed' */

    setUserDone(revert ? false : true);

    if(!revert){
      /* Update user answer */
      let userIndex = getUserIndex();
      
      if(userIndex >= 0){
        let ansObj = getAnswerIndex(userIndex);
        let ansIndex = ansObj.idx;

        if(ansIndex >= 0){
          props.updateRoomData(`JoinedUsers/${userIndex}/answers/${ansIndex}/val`, value)
        } else {
          props.updateRoomData(`JoinedUsers/${userIndex}/answers/${ansObj.length || 0}`, {q: questionNum, rnd: roundNum, val: value})
        }

      }
    }    
  }

  const setResult = (correct) => {
    /* Update user answer */
    let userIndex = getUserIndex();
      
    if(userIndex >= 0){
      let ansObj = getAnswerIndex(userIndex);
      let ansIndex = ansObj.idx;
      
      if(ansIndex >= 0){
        props.updateRoomData(`JoinedUsers/${userIndex}/answers/${ansIndex}/correct`, correct);
      } else {
        props.updateRoomData(`JoinedUsers/${userIndex}/answers/${ansObj.length || 0}`, {q: questionNum, rnd: roundNum, val: false, correct: correct})
      }
    }
    
  }

  switch(type.toLowerCase()){
    case "music":
      let songSrc = props.questionData[questionSetID][questionNum].Song;
      return <Music headerText={headerText} allowInput={allowInput} src={songSrc} userDone={userDone} setAsDone={setAsDone} curAns={ans}/>;
    case "picture":
      let imgSrc = props.questionData[questionSetID][questionNum].Image;
      return <Picture headerText={headerText} allowInput={allowInput}  imgSrc={imgSrc} userDone={userDone} setAsDone={setAsDone} curAns={ans}/>;
    case "question":
      let question = props.questionData[questionSetID][questionNum].Question;
      return <Generic headerText={headerText} question={question} allowInput={allowInput}  userDone={userDone} setAsDone={setAsDone} curAns={ans}/>;
    case "choice":
      let cQues = props.questionData[questionSetID][questionNum].Question;
      let choices = props.questionData[questionSetID][questionNum].Choices;
      return <Choice headerText={headerText} question={cQues} choices={choices} allowInput={allowInput} userDone={userDone} setAsDone={setAsDone} curAns={ans}/>;
    case "answer":

      return <Answers type={props.questionData[questionSetID].type} questionData={props.questionData[questionSetID][questionNum]} setResult={setResult} allowInput={allowInput} curAns={ans} />
    default:
      return <div>Bad type found - err</div>
  }
  
}

export default Question;
