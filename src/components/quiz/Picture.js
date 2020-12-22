import React from 'react';

function Picture(props) {  

  console.log(props.imgSrc)

  return (
    <div>
        <h2>{props.headerText}</h2>      
        <img src={props.imgSrc} alt="Question"/>
    </div>
  );
}

export default Picture;
