import React, {useEffect, useState, useRef} from 'react';

import ReactPlayer from 'react-player/soundcloud';

import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import repeatImage from "../../assets/repeat.png";

import padlockLocked from "../../assets/padlockLocked.png";
import padlockUnlocked from "../../assets/padlockUnlocked.png"

function Answers(props) {  

    const [userAnswer, setUserAnswer] = useState("");
    const [disabledCor, setDisabledCor] = useState(false);
    const [disabledInc, setDisabledInc] = useState(false);

    const musicPlayer = useRef(null);
    const musicControllerRef = useRef(null);
    const musicProgressRef = useRef(null);

    const [playerVolume] = useState(0.8);

    const [playing, setPlaying] = useState(false);
    const [playAll, setPlayAll] = useState(false);
    const [hitEnd, setHitEnd] = useState(false);

    const [progress, setProgress] = useState(0);

    const musicProgress = (e) => {
        setProgress(e.played * 100);
        if(e.playedSeconds > props.questionData.endTime && !playAll){            
            setPlaying(false);
            setHitEnd(true);
        } else if (e.playedSeconds < props.questionData.statTime && !playAll){
            musicPlayer.current.seekTo(props.questionData.startTime, 'seconds');
        }
    }

    const setPlay = (play) => {
        console.log("hit end", hitEnd);
        if(hitEnd){
            musicPlayer.current.seekTo(props.questionData.startTime, 'seconds');
        }

        setPlaying(play);
    }
        
    const replayTrack = () => {
        setHitEnd(false);
        if(playAll) musicPlayer.current.seekTo(0, 'seconds');
        else musicPlayer.current.seekTo(props.questionData.startTime, 'seconds');
        setPlaying(true);
    }

    const handlePlayerControllerClick = (e) => {
        setHitEnd(false);
        let boundary1 = musicControllerRef.current.getBoundingClientRect();
        let boundary2 = musicProgressRef.current.getBoundingClientRect();

        let xStart = boundary2.x;
        let newProgressPercentage = ((e.pageX - xStart) / boundary1.width);

        console.log(newProgressPercentage);

        setProgress(newProgressPercentage * 100);
        musicPlayer.current.seekTo(newProgressPercentage, 'fraction');

    }

    const getQuestion = () => {
        const _style = {
            ...(props.color && {
              backgroundColor: props.color
            }),
            width: `${progress}%`
          };
        switch(props.type.toLowerCase()){
            case "music":     
                return (
                <div>
                     <div id="musicControls">
                        {playing === true ? <img src={pauseImage} className="musicIcon" alt="musicPlay" onClick={() => setPlay(false)}/> : <img src={playImage} className="musicIcon" alt="musicPause" disabled={hitEnd} onClick={() => setPlay(true)}/>}
                        <img src={repeatImage} alt="musicReplay" className="musicIcon" onClick={() => replayTrack()} />
                        <img src={playAll ? padlockUnlocked : padlockLocked} alt={playAll ?  "play snippet" : "play all"} className="musicIcon" onClick={() => setPlayAll(playAll ? false : true)}/>
                    </div>
                    {playAll ? <div ref={musicControllerRef} onClick={(e) => handlePlayerControllerClick(e)}>
                        <div className="musicPlayerProgress">
                            <div ref={musicProgressRef} className="musicPlayerFill" style={_style}></div>
                        </div>    
                    </div> : <></>}
                    <ReactPlayer ref={musicPlayer} id="quizz-music-player"
                        url={`https://soundcloud.com/${props.questionData.Song}` }
                        playing={playing}
                        volume={playerVolume}
                        onProgress={(e) => musicProgress(e)}/>
                </div>);
            case "picture":
                return <div id="pictureQuestion"><img src={props.questionData.Image} alt="Question"/></div>
            case "question":
            case "choice":
                return <div>{props.questionData.Question}</div>
            default:
                return <div>err</div>
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const getAnswer = () => {
        const useChoice = props.questionData.Choices !== null && props.questionData.Choices !== undefined;
        switch(props.type.toLowerCase()){
            case "music":     
            case "picture":
            case "question":
                if(useChoice && isNumeric(props.questionData.Answer))
                    return <span>{props.questionData.Choices[props.questionData.Answer]}</span>
                else
                    return <span>{props.questionData.Answer}</span>
            default:
                return <span>err</span>
        }
    }

    const submitResult = (correct) => {
        props.saveResult(correct);
    }

    useEffect(() => {    
        const curAns = props.getCurrentAnswer();
        const curCorrect = props.getAnswerCorrect();

        if(props.allowInput && (curAns !== undefined && curAns !== null)){
            const useChoice = props.questionData.Choices !== null && props.questionData.Choices !== undefined;

            if(useChoice)
                setUserAnswer(props.questionData.Choices[curAns]);
            else
                setUserAnswer(curAns);
        }
    
        if(curCorrect !== undefined && curCorrect !== null){
            setDisabledCor(curCorrect === true);
            setDisabledInc(curCorrect === false);
        }else{
            setDisabledCor(false);
            setDisabledInc(false);
        }

    }, [props]);
   
    return (
        <div id="answerSummary">
            <h2>Round Answers</h2>
            <div id="answerSummaryQuestion">{getQuestion()}</div>
            <div id="answerSummaryContainer">
                {props.allowInput ? <div className="answerSummaryAnswer"><span>Your answer: </span><span>{userAnswer}</span></div> : <> </>}
                <div className="answerSummaryAnswer"><span>Correct answer: </span>{getAnswer()}</div>
            </div>
            <div id="answerSummaryButtons">
                <span><button disabled={disabledCor} onClick={()=> submitResult(true)}>Correct</button></span>
                <span><button disabled={disabledInc} onClick={()=> submitResult(false)}>Incorrect</button></span>
            </div>
        </div>
    );
}

export default Answers;
