import React from 'react';

function NotFound(props) {  

  return (
    <div id="blizzard">
      <div id="notFound">
        <div>404 - Not found!</div>
        <div id="notFoundReturn"><span onClick={() => (props.history.push("/join"))}>Take me back</span></div>
      </div>
      <div className="falling-snow"></div>
    </div>
  );
}

export default NotFound;
