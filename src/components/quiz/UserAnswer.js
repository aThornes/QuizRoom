
import React, {useState, useEffect} from 'react';

function UserAnswer(props) {  

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [editing, setEditing] = useState(false);

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
      if(ans !== null && ans !== "" && !editing)
        setSubmitted(true);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props]);

  const submitChoiceAnswer = (idx) => {    
    setAnswer(idx);
    props.saveAnswer(idx);      
    setSubmitted(true);
  }

  const submitAnswer = () => {
    if(!props.allowInput){
      props.saveAnswer("Completed");
    } else {
      props.saveAnswer(answer);
    }
    setSubmitted(true);
  }

  const getChoiceOptions = () => {
    return (<>
      {props.choices.map((choice, idx) => {
        return <div className="buttonContainer"key={idx}><button className={`choiceButton-${answer === idx ? "selected" : ""}`} disabled={!props.allowInput || answer === idx} onClick={() => submitChoiceAnswer(idx)}>{choice}</button></div>
      })}
    </>);
  }

  const getInputField = () => {
    if(!submitted && props.allowInput) return <input value={answer} onChange={(e) => {setAnswer(e.target.value)}}></input> ;
    else return <> </>;
  }

  const submitInputAnswer = (e) => {
    e.preventDefault();
    if(!submitted){
      submitAnswer();
      setEditing(false);
    } else {
      setSubmitted(false);
      setEditing(true);
    }
  }

  if(props.choices){
    return (
    <div id="userInput">
      <div id="userOptions">{getChoiceOptions()}</div>
    </div>);
  } else {
    return (
    <div id="userInput">
      <form onSubmit={(e) => submitInputAnswer(e)}>
        <div id="inputField">
          {getInputField()}
        </div>        
        <button id="submitButton">{submitted ? "Change Answer" : "I'm Done!"}</button>
      </form>
    </div>
    );
  }
}

export default UserAnswer;
