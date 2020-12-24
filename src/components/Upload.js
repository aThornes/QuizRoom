import React, {useState, useEffect} from 'react';

import "../assets/css/input.css"

import makeID from './utils';

function Upload(props) {  

    let [user, setUser] = useState("");
    let [pass, setPass] = useState("");
    let [showErr, setShowErr] = useState(false);

    let [userInput, setUserInput] = useState(null);

    let [questionIDs, setQuestionIDs] = useState(null);
    let [processed, setProcessed] = useState(null);

    let [roomCode, setRoomCode] = useState("");

    useEffect(() => {
      props.authUpdate();
      props.getRoomList();
    }, []);

    const logUser = async(e) => {
        e.preventDefault();
    
        const success = await props.authLogin(user,pass);
    
        if(!success)
          setShowErr(true);
    }

    const getLogin = () => {
        return(
            <div>
                <form id="adminLogin" onSubmit={(e) => logUser(e)}>
                  <div>
                    <input type="text" name="username" value={user} onChange={(e) => {setUser(e.target.value)}} />
                  </div>
                  <div>
                    <input type="password" name="password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
                  </div>
                  <div>
                    <button>Go</button>
                  </div>               
                </form>
                {showErr ? <div>*Invalid credentials</div> : <></>}
            </div>   
        );
      }

    const uploadDataToDB = () => {
      setProcessed(false);

      const dataLines = userInput.split(",");

      let dataObjs = [[]];
      let objCount = 0;
      for(let i = 0; i < dataLines.length; i ++){
        if(dataLines[i].includes("^START_ROUND^")){
          dataObjs.push([]);
          objCount++;
        } else {
          dataObjs[objCount].push(dataLines[i]);       
        }
      }

      let rounds = {};
      let idList = [];
      let lastTitle = null;
      let questionCounter = 0;

      let curID = null;

      dataObjs.forEach(obj => {
        if(obj && obj.length > 4){       
          if(obj[0] !== lastTitle){
            lastTitle = obj[0];
            let newID = makeID(4);
                        
            while(idList.includes(newID)) newID = makeID(4);
            
            idList.push(newID);
            
            rounds[newID] = {};
            if(obj[0] === "Intro's"){
              rounds[newID].type = "Music";
            } else
              rounds[newID].type = "Question";
            rounds[newID].text = obj[0];
            questionCounter = 0;
            
            curID = newID;
          }

          if(rounds[curID].type !== "Music" && obj[4] && obj[4].length > 0){
            const c1 = (obj[4] && obj[4].length > 0) ? obj[4] : null;
            const c2 = (obj[5] &&obj[5].length > 0) ? obj[5] : null;
            const c3 = (obj[6] &&obj[6].length > 0) ? obj[6] : null;
            const c4 = (obj[7] &&obj[7].length > 0) ? obj[7] : null;

            let num = -1;
            if(obj[3] === c1) num = 0;
            else if(obj[3] === c2) num = 1;
            else if(obj[3] === c3) num = 2;
            else if(obj[3] === c4) num = 3;

            let answer = num >= 0 ? num : obj[3];

            rounds[curID][questionCounter] = {Question: obj[2], Answer: answer, Choices: [c1, c2, c3, c4]};
          } else 

          if(rounds[curID].type === "Music"){
            rounds[curID][questionCounter] = {Song: obj[2], Answer: obj[3], startTime: obj[4], endTime: obj[5]};
          }
          else
            rounds[curID][questionCounter] = {Question: obj[2], Answer: obj[3]};

          questionCounter++;
        }
      });

      setQuestionIDs(idList);

      props.overwriteQuestionList(rounds);

      setProcessed(true);
    }

    const getInput = () => {
      return(
        <div id="uploadContainer">
          <div id="uploadText">Paste comma delimited text below</div>
          <input id="uploadDBData" type="text" onChange={(e) => setUserInput(e.target.value)}></input>
          <div id="uploadSubmit">
            <button onClick={() => {uploadDataToDB()}}>Upload</button>
          </div>
        </div>
      );
    }

    const setRoomQuestions = () => {
      if(props.roomList.includes(roomCode) && questionIDs){
        let newQuestions = [];
        questionIDs.forEach(id => {
          newQuestions.push({id: id, limit: -1, randomOrder: false});
        });

        props.updateRoomData(roomCode,"Questions", newQuestions);
      }
    }

    if(props.auth){
      switch(processed){
        case null:
          return(<div>{getInput()}</div>);
        case false:
          return(<div>Processing...</div>);
        case true:
            return(<>
            <div>All done!</div>
            <div>
              <div>Add all to room?</div>
              <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input>
              <button onClick={() => setRoomQuestions()}>Confirm</button>
            </div>
            </>);
        default:
          return <div>Something went wrong</div>
      }      
    } else {
        return(<div>{getLogin()}</div>);
    }

    
}

export default Upload;
