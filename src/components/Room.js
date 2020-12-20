import React, {useState, useEffect} from 'react';

import RoomHeader from "./quiz/RoomHeader";
import RoomFooter from "./quiz/RoomFooter";

import Setup from './quiz/Setup';
import Question from './quiz/Question';
import Finale from './quiz/Finale';

import makeID from "./utils";

function Room(props) {  
  
  let [roomCode, setRoomCode] = useState(null);
  let [name, setName] = useState("");
  let [ready, setReady] = useState(false);
  let [invalid, setInvalid] = useState(null);
  let [userAdmin, setUserAdmin] = useState(null);
  let [userData, setUserData] = useState(null);

  const [logKey, setLogKey] = useState(null);
  
  useEffect(() => {

    /* Check if user auth state needs to be updated */
    props.authUpdate();

    if(!props.questionData) props.getQuestionData();

    /* Check if room code is present */
    let urlPath = props.history.location.pathname;

    if(urlPath[urlPath.length - 1] === "/") urlPath = urlPath.substring(0, urlPath.length - 2);

    let codeNum = urlPath.substring(urlPath.lastIndexOf('/') + 1);

    /* Only perform this if room data is not present or room code has changed*/
    if(props.roomData === null || codeNum !== roomCode ){
      setRoomCode(codeNum);
        
      props.getRoomData(codeNum);      
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  useEffect(() => {
      if(props.roomData){
        let foundUserData = props.roomData.JoinedUsers.find(val => val.name === name);
        setUserData(foundUserData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData, name])

  const updateRoomData = (addr, newData) => {
    props.updateRoomData(roomCode, addr, newData);
  }

  const getHeader = () => {
    return <RoomHeader
            roomCode={roomCode} 
            loggedName={name}
            roomData={props.roomData}/>;
  }

  const getFooter = () => {
    return <RoomFooter 
            auth={props.auth} 
            authLogin={props.authLogin} 
            authLogout={props.authLogout} 
            isAdmin={userAdmin}
            roomData={props.roomData}
            updateRoomData={updateRoomData}
            questionData={props.questionData}/>;
  }
  

  const displayQuizData = () => {
    switch(props.roomData.Stage){
      case 0:
        return ( <> {getHeader()} <Setup roomCode={roomCode} users={props.roomData.JoinedUsers}/> {getFooter()}</> );
      case 1:
        return ( <> {getHeader()}  <Question roomData={props.roomData} updateRoomData={updateRoomData} questionData={props.questionData} users={props.roomData.JoinedUsers} userData={userData}/> {getFooter()}</> );
      case 2:
        return ( <> {getHeader()}  <Finale users={props.roomData.JoinedUsers}/> {getFooter()}</> );
      default:
        return <div>Invalid stage</div>
    }    
  }  

  const submitName = (e) => {
    e.preventDefault();
    if(name.length >= 3 && name.length <= 15){
      let nameKeys = Object.keys(props.roomData.JoinedUsers);
      let found = false;
      for(let i = 0; i < nameKeys.length; i++){
        if(name.toLowerCase() === props.roomData.JoinedUsers[nameKeys[i]].name.toLowerCase()){
          found = true;
          break;
        }
      }

      if(found){
        setInvalid("Name already in use!");
      } else {

        let count = Object.keys(props.roomData.JoinedUsers).length;

        let newLogKey = makeID(32);

        let addData = {name: name, key: newLogKey}

        props.roomData.JoinedUsers.push(addData);

        props.updateRoomData(roomCode, `JoinedUsers/${count}`, addData);

        setReady(true);

        /* Store cookie to keep user login */
        localStorage.setItem(`quizzicle-log-key-${roomCode}`, newLogKey);
        setLogKey(newLogKey);
      }

    } else {
      setInvalid(name.length < 3 ? "Name too short! (min: 3 char)" : "Name too long! (max: 15 char)");
    }
  }

  const userEnterName = () => {
    return(
      <div>
        Enter your name:
        <form autoComplete="off" onSubmit={(e) => submitName(e)}>
          <input data-lpignore="true" type="text" name="username" value={name} onChange={(e) => {setName(e.target.value)}}></input>
        </form>
        {invalid ? <div>*Invalid username - {invalid}</div> : <></>}
      </div>
    );
  }

  /* Check room code and data is valid before displaying main quiz */
  if(roomCode && roomCode.length !== 5){
    /* Invalid room code */
    if(roomCode === "roo" || roomCode === "room"){
      //props.history.push("/join"); //No code provided so take user to join page
      return (<div> Invalid room code </div>);     
    } else {
      return (<div> Invalid room code </div>);     
    }
  } else if(props.roomData === false){
    /* Room code invalid */
    return (<div> Invalid room code </div>);
  }
  else if(roomCode && props.roomData){    
    
    if(!ready && !logKey){
      /* Check if cookie has a valid key */
      let logKey = localStorage.getItem(`quizzicle-log-key-${roomCode}`);
      
      let keyList = Object.keys(props.roomData.JoinedUsers);
      
      for(let i = 0; i < keyList.length; i++){
        if(logKey === props.roomData.JoinedUsers[keyList[i]].key){
          setName(props.roomData.JoinedUsers[keyList[i]].name);
          setReady(true);
          setLogKey(logKey);
          break;
        }
      }
    }

    if(userAdmin === null && name && name.length >= 3){
      if(props.roomData.JoinedUsers[props.roomData.Admin].name === name) setUserAdmin(true);
      else setUserAdmin(false);
    }

    /* Room success */
    if(ready)
      return displayQuizData();
    else if(props.roomData.Stage === 0)
      return userEnterName();
    else return <div>Quiz has already started!</div>
  } 
  else{}
    return (    
      <div>
        Loading...
      </div>
    );
  }


export default Room;
