import React, {useState, useEffect} from 'react';

function Generic(props) {  

  const [answer, setAnswer] = useState("");

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


  return (
    <div>
      <h2>{props.headerText}</h2>
        {!props.userDone ? 
         <> <div>{props.question}</div>
          {props.allowInput ? <input value={answer} onChange={(e) => {setAnswer(e.target.value)}}></input> : <> </>}</> :
         <> </>}
       
        {!props.userDone ? <button onClick={() => {props.setAsDone(answer)}}>I'm done!</button> : <button onClick={() => {props.setAsDone(answer, true)}}>Go back!</button>}
        
    </div>
  );
}

export default Generic;
