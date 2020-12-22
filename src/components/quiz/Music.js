import React, {useState, useRef, useEffect} from 'react';
import ReactPlayer from 'react-player/soundcloud'

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
    if(e.playedSeconds > props.endTime){
      setPlay(false);
      setHitEnd(true);
    }
  }

  const setPlay = (play) => {
    setPlaying(play);
  }

  const replayTrack = () => {
    musicPlayer.current.seekTo(props.startTime, 'seconds');
    setPlay(true);
  }

  

  return (
    <div>
        <ReactPlayer ref={musicPlayer} id="quizz-music-player"
          url={`https://soundcloud.com/${props.src}` }
          playing={playing}
          volume={playerVolume}
          onProgress={(e) => musicProgress(e)}/>
       
        {playing === true ? <button onClick={() => setPlay(false)}>Pause</button> : <button disabled={hitEnd} onClick={() => setPlay(true)}>Play</button>}
        <button onClick={() => replayTrack()}>Replay</button>
    </div>
  );
}

export default Music;
