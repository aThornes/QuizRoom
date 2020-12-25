import React, {useEffect, useState} from 'react';

function Finale(props) {  
    
  const snowArray = Array(199).fill(1);

  const [userScores, setUserScores] = useState([]);

  useEffect(()=>{
    setUserScores([]);

    /* Calculate scores for each joined user */
    const playerKeys = Object.keys(props.roomData.JoinedUsers);

    let scoreObj = [];

    playerKeys.forEach(key => {
      const playerObj = props.roomData.JoinedUsers[key];
      let scoreCount = 0;
      if(playerObj.answers && playerObj.hidden !== true){
        const answerKeys = Object.keys(playerObj.answers);
        answerKeys.forEach(aKey => {
          const ansObj = playerObj.answers[aKey];
          if(ansObj.correct === true){
            scoreCount++;
          }
        });
        scoreObj.push({name: props.roomData.JoinedUsers[key].name, score: scoreCount});
      }      
    });

    scoreObj.sort((a,b) => {
      return b.score - a.score;
    });

    setUserScores(scoreObj);
  }, [props])

  return (
    <>
    <div className="summaryImage"></div>
    <div>
      <div className="absolute">
      {snowArray.map((a, idx) => {
          return <div className="snow" key={idx}/>
      })}</div>
    </div>
    <div id="roundHeaderContainer">
        <div id="roundHeader-thin">Final Scores!</div>
        { userScores ? 
          <div id="roundScores">
            {userScores.map((obj, idx) => {
              return <div className="scoreContainer" key={idx}><div>{obj.name}</div><div>{obj.score}</div></div>
            })}
          </div> : <> Loading...</>}
    </div>
    </>
  );
}

export default Finale;
