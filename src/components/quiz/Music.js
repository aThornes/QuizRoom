import React, {useState, useRef} from 'react';
import ReactPlayer from 'react-player/lazy';
import SoundPlayer from 'react-player/soundcloud';

import "../../assets/css/music.css"
import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import repeatImage from "../../assets/repeat.png";

function Music(props) {  

  const [playing, setPlaying] = useState(false);

  const [ready, setReady] = useState(false);
  const [volume] = useState(0.3);

  const musicPlayer = useRef(null);

  const setPlay = (newState) => {
    if(ready){
      setPlaying(newState);
    }
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
    
    if(e.playedSeconds > Number(props.endTime)){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
      setPlaying(false);
    } else if (e.playedSeconds < Number(props.startTime)){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    }
  }


  const getPlayer = () => {

    const isYT = props.src.includes("youtube");

    const musicSource = isYT ? props.src : `https://soundcloud.com/${props.src}`;

    if(isYT){
      return(<ReactPlayer 
        ref={musicPlayer}
        className="quizz-music-player"
        url={musicSource}
        playing={playing}
        volume={volume}
        onReady={(e) => handleReady(e)}
        onProgress={(e) => handleProgress(e)}
        onError={(e) => handleError(e)}
      />);    
    } else {
      return(<SoundPlayer 
        ref={musicPlayer}
        className="quizz-music-player"
        url={musicSource}
        playing={playing}
        volume={volume}
        onReady={(e) => handleReady(e)}
        onProgress={(e) => handleProgress(e)}
        onError={(e) => handleError(e)}
      />);    
    }    
  }

  return (
    <div>
      <div id="musicHeader">{props.headerText}</div>
      {getPlayer()}        
      <div id="musicControls">
        {playing === true ? <img src={pauseImage} className={`musicIcon ${!ready ? "iconDisabled" : ""}`} alt="musicPlay" onClick={() => setPlay(false)}/> : <img src={playImage} className={`musicIcon ${!ready ? "iconDisabled" : ""}`} alt="musicPause" onClick={() => setPlay(true)}/>}
        <img src={repeatImage} alt="musicReplay" className={`musicIcon ${!ready ? "iconDisabled" : ""}`} onClick={() => replayTrack()} />
      </div>
    </div>
    
  );
}

export default Music;
