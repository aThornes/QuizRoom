import React, { useState } from 'react';

function Join(props) {  

  let [roomCode, setRoomCode] = useState('');

  const submitRoomCode = (e) => {
    e.preventDefault();

    props.history.push(`/room/${roomCode}`);
  }

  const updateRoomCode = (e) => {
    if(e.target.value.length <= 5)
      setRoomCode(e.target.value.toUpperCase());
  }

  return (
    <div>
        <div>Room code</div>
        <form onSubmit={(e) => submitRoomCode(e)}>
          <input type="text" name="roomCode" value={roomCode} onChange={(e) => {updateRoomCode(e)}}></input>
        </form>
    </div>
  );
}

export default Join;
