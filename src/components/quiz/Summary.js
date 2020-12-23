import React from 'react';

function Summary(props) {  
    
  const snowArray = Array(199).fill(1);

  return (
    <>
    <div className="absolute">
    {snowArray.map((a, idx) => {
        return <div className="snow" key={idx}/>
    })}</div>
    <div id="roundHeaderContainer">
        <div id="roundHeader">Round {props.roundNum + 1} Summary</div>
        <div id="roundSubHeader">{props.headerText}</div>
    </div>
    </>
  );
}

export default Summary;
