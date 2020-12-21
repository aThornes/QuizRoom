import React from 'react';

function Answers(props) {  

    const getQuestion = () => {
        switch(props.type.toLowerCase()){
            case "music":     
                return <div>Music not yet supported</div>
            case "picture":
                return <div>Picture</div>
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
                return <div><div>Artist: {props.questionData.Artist}</div><div>Song: ${props.questionData.Track}</div></div>
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
        props.setResult(correct);
    }

    let userAnswer = "Loading";
    let disabledCor, disabledInc = false;
    
    if(props.curAns){
        userAnswer = props.curAns.val;
        disabledCor = props.curAns.correct === true;
        disabledInc = props.curAns.correct === false;
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
