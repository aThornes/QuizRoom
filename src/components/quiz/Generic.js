import React from 'react';

function Generic(props) {  

  return (
    <div>
      <h2>{props.headerText}</h2>      
      <div>{props.question}</div>
    </div>
  );
}

export default Generic;
