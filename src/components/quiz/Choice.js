import React, {useState, useEffect} from 'react';

function Choice(props) {  

  const [answer, setAnswer] = useState("");

  const [highlightState, setHighlightState] = useState(-1);

  useEffect(() => {
    if(props.curAns){
      setAnswer(props.curAns.val);
      props.setAsDone(props.curAns.val);
    } else {
      setAnswer("");
      props.setAsDone("", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.curAns]);

  const userSelectAnswer = (ansIndex) => {
    if(highlightState < 0){
      setHighlightState(ansIndex);
    } else{
      if(ansIndex === highlightState){
        props.setAsDone(true);
        setHighlightState(-1);    
      } else {
        setHighlightState(ansIndex);    
      }
    }
  }

  return (
    <div>
        <h2>{props.headerText}</h2>

        {!props.userDone ? 
        <> 
          <div>{props.question}</div>
          {props.choices.map((choice, idx) => {
            return <button className={`choiceButton ${highlightState === idx ? "selected" : ""}`}disabled={!props.allowInput} key={idx} onClick={() => userSelectAnswer(idx)}>{choice}</button>
          })}
        </> : <> </>  
        }

        {!props.userDone ? <> </>: <button onClick={() => {props.setAsDone(answer, true)}}>Go back!</button>}

    </div>
  );
}

export default Choice;
