import React from 'react';


function Setup(props) {  

  const getUserList = () => {
    let ls = [];
    let userKeys = Object.keys(props.users);

    userKeys.forEach(k => ls.push(props.users[k].name));

    return ls;
  }

  return (
    <div id="setupContainer">
       <div id="setupWaiting">Waiting for others!</div>
       <div id="setupListContiner">
        <div id="listTitle">Who's in?</div>
        <div id="list">
            {getUserList().map(((user, idx) => {
                return <div key={idx}>{user}</div>
            }))}
        </div>
       </div>
    </div>
  );
}

export default Setup;
