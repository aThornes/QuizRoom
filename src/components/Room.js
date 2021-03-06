import React, {useState, useEffect} from 'react';

import RoomHeader from "./quiz/RoomHeader";
import RoomFooter from "./quiz/RoomFooter";

import Setup from './quiz/Setup';
import Question from './quiz/Question';
import Finale from './quiz/Finale';

import makeID from "./utils";

import "../assets/css/main.css";
import "../assets/css/setup.css";
import "../assets/css/headerFooter.css";
import "../assets/css/answer.css"
import "../assets/css/question.css"
import "../assets/css/picture.css"
import "../assets/css/summary.css"

function Room(props) {  
  
  let [roomCode, setRoomCode] = useState(null);
  let [name, setName] = useState("");
  let [ready, setReady] = useState(false);
  let [invalid, setInvalid] = useState(null);
  let [userAdmin, setUserAdmin] = useState(null);
  let [userData, setUserData] = useState(null);

  const [logKey, setLogKey] = useState(null);

  const snowArray = Array(199).fill(1);
  
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
      if(props.roomData && props.roomData.JoinedUsers){

        let userKeys = Object.keys(props.roomData.JoinedUsers);

        let foundUserData = null;
        userKeys.forEach(user => {
          if(props.roomData.JoinedUsers[user].key === logKey) foundUserData = props.roomData.JoinedUsers[user];
        })

        setUserData(foundUserData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.roomData, name])

  const updateRoomData = (addr, newData) => {
    props.updateRoomData(roomCode, addr, newData);
  }

  const leaveRoom = () => {
    props.history.push("/join");
    window.location.reload();
  }

  const getHeader = () => {
    const showCode = props.roomData.Stage !== 1;
      return <RoomHeader
              roomCode={roomCode} 
              loggedName={name}
              roomData={props.roomData}
              showProgress={props.roomData.Stage === 1}
              leaveRoom ={leaveRoom}
              showCode={showCode}/>;    
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
        return ( <> {getHeader()}  <Finale roomData={props.roomData}/> {getFooter()}</> );
      default:
        return <div>Invalid stage</div>
    }    
  }  

  const submitName = (userInput) => {
    if(name.length >= 3 && name.length <= 15){
      let found = false;
      if(props.roomData.JoinedUsers){
        let nameKeys = Object.keys(props.roomData.JoinedUsers);
        for(let i = 0; i < nameKeys.length; i++){
          if(name.toLowerCase() === props.roomData.JoinedUsers[nameKeys[i]].name.toLowerCase()){
            found = true;
            break;
          }
        }
      }

      if(found){
        setInvalid("Name already in use!");
      } else {

        let newLogKey = makeID(32);
        let userKey = makeID(4);

        while(props.roomData.JoinedUsers && Object.keys(props.roomData.JoinedUsers).includes(userKey)) userKey = makeID(4);

        let addData = {name: name, key: newLogKey, input: userInput}

        props.updateRoomData(roomCode, `JoinedUsers/${userKey}`, addData);

        setReady(true);

        /* Store cookie to keep user login */
        localStorage.setItem(`quizzicle-log-key-${roomCode}`, newLogKey);
        setLogKey(newLogKey);

        if(props.roomData.Admin !== undefined && props.roomData.Admin !== null){
          /* Check if user is already defined as Admin (tbh this shouldn't even happen) */
          if(userAdmin === null){
            if(props.roomData.JoinedUsers[props.roomData.Admin]){
              if(props.roomData.JoinedUsers[props.roomData.Admin].name === name) setUserAdmin(true);
              else setUserAdmin(false);
            }
          }
        } else {
          /* If there is no admin, allow user to log in (this will set user as admin) Note: this breaks if user joins then leaves before logging in :( ) */
          setUserAdmin(true);
        }
      }
    } else {
      setInvalid(name.length < 3 ? "Name too short! (min: 3 char)" : "Name too long! (max: 15 char)");
    }
  }

  const userEnterName = () => {
    return(
      <div id="nameContainer">
        <div id="nameEnter">Enter your name</div>   
        <div id="nameEnterSuffix">(or teamname)</div>   

        <input data-lpignore="true" type="text" name="username" value={name} onChange={(e) => {setName(e.target.value)}}></input>

        <div id="nameEnterError">{invalid ? <><span id="red">*</span><span>Invalid username - {invalid}</span></> : <></>}</div>

        <div id="nameButtonContainer">
          <span><button className="nameSubmit" onClick={() => submitName(true)}>I'll write on my device</button></span>
          <span><button className="nameSubmit" onClick={() => submitName(false)}>I'll use Pen and Paper</button></span>
        </div>
        
      </div>
    );
  }

  /* Check room code and data is valid before displaying main quiz */
  const renderState = ((roomCode && roomCode.length) !== 5 ? "invalid" : ((roomCode && props.roomData) ? "room" : "load"));

  if(renderState === "invalid"){
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
  else if(renderState === "room"){    
    
    if(!ready && !logKey){
      /* Check if cookie has a valid key */
      let foundKey = localStorage.getItem(`quizzicle-log-key-${roomCode}`);
      
      if(props.roomData.JoinedUsers){
        let keyList = Object.keys(props.roomData.JoinedUsers);
        
        for(let i = 0; i < keyList.length; i++){
          if(foundKey === props.roomData.JoinedUsers[keyList[i]].key){
            setName(props.roomData.JoinedUsers[keyList[i]].name);
            setReady(true);
            setLogKey(foundKey);
            if(props.roomData.Admin !== undefined && props.roomData.Admin !== null){
              if(props.roomData.JoinedUsers[props.roomData.Admin].key === foundKey) setUserAdmin(true);
              else setUserAdmin(false);
            }
            break;
          }
        }
      }
    }


    /* Room success */
    if(ready)
      return displayQuizData();
    else if(props.roomData.Stage === 0)
      return userEnterName();
    else return (
      <>
      <div>
      <div className="absolute">
      {snowArray.map((a, idx) => {
          return <div className="snow" key={idx}/>
      })}</div>
    </div>
      <div id="quizStarted">
        <div>Too late!</div>
        <span>Quiz has already started!</span>
        <span id="returnButton" onClick={() => leaveRoom()}>Return</span>
      </div>
      </>
      );
    } 
  else{
    return (    
      <div id="quizStarted">
        <div className="lds-hourglass"></div>
      </div>
    );
  }
  }


export default Room;
