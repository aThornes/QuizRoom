import React, {useState, useRef, useEffect} from 'react';
import ReactPlayer from 'react-player/soundcloud'

import "../../assets/css/music.css"

import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import repeatImage from "../../assets/repeat.png";

function Music(props) {  

  const [playerVolume] = useState(0.8);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hitEnd, setHitEnd] = useState(false);

  const musicPlayer = useRef(null);

  useEffect(() => {
    if(loading){
      if(musicPlayer.current){
        replayTrack();
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const musicProgress = (e) => {
    if(e.playedSeconds > Number(props.endTime)){
      setPlaying(false);
      setHitEnd(true);
    } else if (e.playedSeconds < Number(props.startTime)){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    }
  }

  const setPlay = (play) => {
    if(hitEnd){
      musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    }

    setPlaying(play);
  }

  const replayTrack = () => {
    musicPlayer.current.seekTo(Number(props.startTime), 'seconds');
    setPlay(true);
  }
  

  return (
    <div>
      <div id="musicHeader">{props.headerText}</div>
      <ReactPlayer ref={musicPlayer} id="quizz-music-player"
        url={`https://soundcloud.com/${props.src}` }
        playing={playing}
        volume={playerVolume}
        onProgress={(e) => musicProgress(e)}/>
        
      <div id="musicControls">
        {playing === true ? <img src={pauseImage} className="musicIcon" alt="musicPlay" onClick={() => setPlay(false)}/> : <img src={playImage} className="musicIcon" alt="musicPause" disabled={hitEnd} onClick={() => setPlay(true)}/>}
        <img src={repeatImage} alt="musicReplay" className="musicIcon" onClick={() => replayTrack()} />
      </div>
    </div>
    
  );
}

export default Music;
