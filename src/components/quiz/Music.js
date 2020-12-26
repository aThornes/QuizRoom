import React, {useState, useRef, useEffect} from 'react';

import ReactPlayer from 'react-player/lazy'


import "../../assets/css/music.css"
import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import repeatImage from "../../assets/repeat.png";

function Music(props) {  

  const [playing, setPlaying] = useState(false);

  const [ready, setReady] = useState(false);
  const [volume] = useState(0.3);

  const [trigger, setTrigger] = useState(false);

  const musicPlayer = useRef(null);

  useEffect(() => {    
    setPlaying(true);    
  }, [trigger]);

  const setPlay = (newState) => {
    if(ready)
      setPlaying(newState);
  }

  const replayTrack = () => {
    musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    setPlay(true);
  }

  const handleReady = (e) => {
    musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    setReady(true);
  }

  const handleError = (e) => {
    console.log(e);
  }

  const handleProgress = (e) => {
    console.log(e);
    if(e.playedSeconds > Number(props.endTime)){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
      setPlaying(false);
    } else if (e.playedSeconds < Number(props.startTime)){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    }


    /* Attempt at 'rebooting' the song on first load */
    if(trigger){
      setPlaying(false);
      setTrigger(true);
    }      
  }


  const getPlayer = () => {

    const musicSource = props.src.includes("youtube") ? props.src : `https://soundcloud.com/${props.src}`;

    return(<ReactPlayer 
      ref={musicPlayer}
      id="quizz-music-player"
      url={musicSource}
      playing={playing}
      volume={volume}
      onReady={(e) => handleReady(e)}
      onProgress={(e) => handleProgress(e)}
      onError={(e) => handleError(e)}
    />);    
  }

  return (
    <div>
      <div id="musicHeader">{props.headerText}</div>
      {getPlayer()}        
      <div id="musicControls">
        {playing === true ? <img src={pauseImage} className="musicIcon" alt="musicPlay" onClick={() => setPlay(false)}/> : <img src={playImage} className="musicIcon" alt="musicPause" onClick={() => setPlay(true)}/>}
        <img src={repeatImage} alt="musicReplay" className="musicIcon" onClick={() => replayTrack()} />
      </div>
    </div>
    
  );
}

export default Music;
