import React from 'react';

function Answers(props) {  

    const getQuestion = () => {
        switch(props.type.toLowerCase()){
            case "music":     
                return <div>Music summary not yet supported</div>
            case "picture":
                return <div>{props.questionData.Image}</div>
            case "question":
            case "choice":
                return <div>{props.questionData.Question}</div>
            default:
                return <div>err</div>
        }
    }

    const getAnswer = () => {
        switch(props.type.toLowerCase()){
            case "music":     
            case "picture":
            case "question":
                return <div>Actual Answer: {props.questionData.Answer}</div>
            case "choice":
                return <div>Actual Answer: {props.questionData.Choices[props.questionData.Answer]}</div>
            default:
                return <div>err</div>
        }
    }

    const submitResult = (correct) => {
        props.saveResult(correct);
    }

    let userAnswer = "Loading";
    let disabledCor, disabledInc = false;

    const curAns = props.getCurrentAnswer();
    const curCorrect = props.getAnswerCorrect();
    
    if(curAns){
        userAnswer = curAns;
        disabledCor = curCorrect === true;
        disabledInc = curCorrect === false;
    }

    
    return (
        <div>
            {getQuestion()}
            <div>Your answer: {userAnswer}</div>
            {getAnswer()}
            <button disabled={disabledInc} onClick={()=> submitResult(false)}>Incorrect</button>
            <button disabled={disabledCor} onClick={()=> submitResult(true)}>Correct</button>
        </div>
    );
}

export default Answers;
