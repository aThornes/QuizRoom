import React, {useState, useEffect} from 'react';

import makeID from '../utils'

import Music from './Music';
import Picture from './Picture';
import Generic from './Generic';
import Answers from './Answers';
import UserAnswer from './UserAnswer';


function Question(props) {  

  const [roundNum, setRoundNum] = useState(null);
  const [questionNum, setQuestionNum] = useState(null);
  const [questionSetID, setQuestionSetID] = useState(null);
  const [type, setType] = useState(null);
  const [headerText, setHeaderText] = useState(null);
  const [allowInput/*, setAllowInput*/] = useState(true);
  const [checkAnswer, setCheckAnswer] = useState(true);

  useEffect(() => {
    if(!props.roomData) return;
    const rnd = props.roomData.RoundNum;
    const qNum = props.roomData.QuestionNum;
    const id = props.roomData.Questions[rnd].id;
    const qType = props.questionData[id].type;
    const text = props.questionData[id].text;

    if(rnd !== roundNum || qNum !== questionNum) setCheckAnswer(true);
    else setCheckAnswer(false);

    setRoundNum(rnd);
    setQuestionNum(qNum);
    setQuestionSetID(id);
    setType(qType);
    setHeaderText(text);

    if(questionNum >= 100){
      setType("answer");
      setQuestionNum(questionNum - 100);
    } 
    
// eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData, props.questionData]);


  const getUserKey = () => {
    let userKey = -1;
    let objKeys = Object.keys(props.roomData.JoinedUsers);
    for(let i = 0; i < objKeys.length; i++){
      if(props.roomData.JoinedUsers[objKeys[i]].name === props.userData.name) {userKey = objKeys[i]; break;} 
    }
    return userKey;
  }  

  const getAnswerKey = () => {
    let uKey= getUserKey();

    const userAnswerList = props.roomData.JoinedUsers[uKey].answers;

    if(userAnswerList){
      let ansKeys = Object.keys(props.roomData.JoinedUsers[uKey].answers);
      let foundKey = null;

      ansKeys.forEach(k=> {
        if(userAnswerList[k].rnd === roundNum && userAnswerList[k].q === questionNum){
          foundKey = k;
        }
      });

      return foundKey;

    } else return null;

  }

  const genKey = (userKey) => {
    let answerKey = makeID(4);

    let keyList = Object.keys(props.roomData.JoinedUsers[userKey]);

    while(keyList.includes(answerKey)) answerKey = makeID(4);

    return answerKey;
  }

  const getCurrentAnswer = () => {
    let uKey= getUserKey();
    let ansKey = getAnswerKey();

    setCheckAnswer(false);
    if(ansKey){
      return props.roomData.JoinedUsers[uKey].answers[ansKey].val;
    } else return null;
  }

  const saveAnswer = (answer) => {
    let uKey= getUserKey();
    let ansKey = getAnswerKey();

    if(ansKey){
      props.updateRoomData(`JoinedUsers/${uKey}/answers/${ansKey}/val`, answer);
    } else {
      ansKey = genKey(uKey);
      props.updateRoomData(`JoinedUsers/${uKey}/answers/${ansKey}`, {rnd: roundNum, q: questionNum, val: answer});
    }
  }

  const saveResult = (result) => {
    let uKey= getUserKey();
    let ansKey = getAnswerKey();

    if(ansKey){
      props.updateRoomData(`JoinedUsers/${uKey}/answers/${ansKey}/correct`, result);
    } else {
      ansKey = genKey(uKey);
      props.updateRoomData(`JoinedUsers/${uKey}/answers/${ansKey}`, {rnd: roundNum, q: questionNum, val: true, correct: result});
    }
  }

  const getQuestion = () => {
    switch(type.toLowerCase()){
      case "music":
        let songSrc = props.questionData[questionSetID][questionNum].Song;
        let startTime = Number(props.questionData[questionSetID][questionNum].startTime);
        let endTime = Number(props.questionData[questionSetID][questionNum].endTime);
        return <Music headerText={headerText} src={songSrc} startTime={startTime} endTime={endTime}/>;
      case "picture":
        let imgSrc = props.questionData[questionSetID][questionNum].Image;
        return <Picture headerText={headerText} imgSrc={imgSrc}/>;
      case "question":
        let question = props.questionData[questionSetID][questionNum].Question;
        return <Generic headerText={headerText} question={question}/>;
      // case "choice":
      //   let cQues = props.questionData[questionSetID][questionNum].Question;
      //   let choices = props.questionData[questionSetID][questionNum].Choices;
      //   return <Choice headerText={headerText} question={cQues} choices={choices} allowInput={allowInput} userDone={userDone} setAsDone={setAsDone} curAns={ans}/>;

      default:
        return <div>Bad type found - err</div>
    }
  }

  const getChoice = () => {
    let choices = props.questionData[questionSetID][questionNum].Choices;
    if(props.questionData[questionSetID][questionNum].Choices){
      return <UserAnswer choices={choices} checkAnswer={checkAnswer} allowInput={allowInput} getCurrentAnswer={getCurrentAnswer} saveAnswer={saveAnswer}/>
    } else {
      return <UserAnswer choices={null} checkAnswer={checkAnswer} allowInput={allowInput} getCurrentAnswer={getCurrentAnswer} saveAnswer={saveAnswer} />
    }
  }
  if(roundNum === undefined || roundNum === null)
    return <div>Loading Question...</div>
  else if(type !== "answer"){
    return (<> {getQuestion()} {getChoice()}</>);
  } else {
    return <Answers type={props.questionData[questionSetID].type} questionData={props.questionData[questionSetID][questionNum]} allowInput={allowInput} getCurrentAnswer={getCurrentAnswer} saveResult={saveResult} />
  }

  

 
  
}

export default Question;
