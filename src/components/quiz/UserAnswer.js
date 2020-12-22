
import React, {useState, useEffect} from 'react';

function UserAnswer(props) {  

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(()=>{
    if(props.checkAnswer){
      let curAns = props.getCurrentAnswer();
      if(curAns !== null && curAns !== "") setAnswer(curAns);
      else {
        setAnswer("");
        setSubmitted(false);
      }
    } else {
      let ans = props.getCurrentAnswer();
      if(ans !== null && ans !== "") 
        setSubmitted(true);
    }

  }, [props]);

  const submitChoiceAnswer = (idx) => {    
    setAnswer(idx);
    props.saveAnswer(idx);      
    setSubmitted(true);
  }

  const submitAnswer = () => {
    props.saveAnswer(answer);
    setSubmitted(true);
  }

  const getSubmitButton = () => {
    if(!submitted){
      return <button onClick={() => {submitAnswer()}}>I'm done!</button>;
    } else {
      return <button onClick={() => {setSubmitted(false)}}>Go back!</button>;
    }
  }

  const getChoiceOptions = () => {
    return (<>
      {props.choices.map((choice, idx) => {
        return <button className={`choiceButton ${answer === idx ? "selected" : ""}`} disabled={!props.allowInput} key={idx} onClick={() => submitChoiceAnswer(idx)}>{choice}</button>
      })}
    </>);
  }

  const getInputField = () => {
    if(!submitted && props.allowInput) return <input value={answer} onChange={(e) => {setAnswer(e.target.value)}}></input> ;
    else return <> </>;
  }

  if(props.choices){
    return (<>{getChoiceOptions()}</>);
  } else {
    return (<>{getInputField()}{getSubmitButton()}</>);
  }
}

export default UserAnswer;
