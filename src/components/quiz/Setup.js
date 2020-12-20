import React from 'react';

function Setup(props) {  

  return (
    <div>
       <div>Waiting for others!</div>
       <div>
           {props.users.map(((user, idx) => {
               return <div key={idx}>{user.name}</div>
           }))}
       </div>
    </div>
  );
}

export default Setup;
