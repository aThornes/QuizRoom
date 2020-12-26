import React from 'react';

function Picture(props) {  

  return (
    <div id="pictureQuestion">
        <h2>{props.headerText}</h2>      
        <img src={props.imgSrc} alt="Question"/>
    </div>
  );
}

export default Picture;
