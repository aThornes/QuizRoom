import React, {useState, useEffect} from 'react';

function Create(props) {  

  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");
  let [showErr, setShowErr] = useState(false);

  let [roomCode, setRoomCode] = useState("");

  let [roomState, setRoomState] = useState("code");

  useEffect(() => {
    props.authUpdate();    
    props.getRoomList();
    props.getQuestionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const logUser = async(e) => {
    e.preventDefault();

    const success = await props.authLogin(user,pass);

    if(!success)
      setShowErr(true);
  }

 

  const submitRoomCode = (e) => {
    e.preventDefault();

    // if(props.roomList.includes(roomCode)){
    //   props.getRoomData(roomCode);
    //   setRoomState("modify");
    // }
    // else
    //   setRoomState("new");
    
  }

  const createRoom = () => {
    const newRoomData = {Stage: 0, QuestionNum: -1, roundNum: 0};
    props.updateRoomData(roomCode, "", newRoomData);
    setRoomState("modify");
    props.getRoomData(roomCode);
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

  const getCodeContainer = (full) => {
    console.log(props.questionData);
    console.log(props.roomData);
    if(!props.questionData || !props.roomData) return <> </>;
    let keys;
    
    if(full)
    keys = Object.keys(props.questionData);
    else
    keys = props.roomData.questions ? Object.keys(props.roomData.questions) : [];

    console.log(keys);

    return (<>{keys.map((k, idx) =>{
      if(k !== "text" && k !== "type")
        return <div key={idx}>{props.questionData[k]}</div>
    })}</>);
  }

  const updateRoomCode = (val) =>{
    if(val.length <= 5)
      setRoomCode(val.toUpperCase());
  }

  if(props.auth){

    switch(roomState){
      case "code":
        return (
          <div className="adminOptions">
            Create functionality not yet available
            <div>Enter your room code</div>
            <form onSubmit={(e) => submitRoomCode(e)}>
              <input value={roomCode} onChange={(e) => updateRoomCode(e.target.value)}></input>
            </form>
          </div>
        );  
      case "modify":
        return (
          <div className="adminOptions">
            <div className="adminOptionContainer">
              <div>
                {getCodeContainer(true)}
              </div>
              <div>
                <span>+</span>
                <span>-</span>
              </div>
              <div>
              <select name="credit_card" size="3">
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                </select>
              </div>
            </div>
          </div>
        );    
      case "new":
        default:
          return (            
          <div className="adminOptions">
            <div>Code '{roomCode}' does not exist, would you like to create it?</div>
            <div id="createChoices">
              <button className="modalButton" onClick={() => createRoom()}>Yes</button>
              <button className="modalButton" onClick={() => setRoomState("code")}>No</button>
            </div>
          </div>
          );    
    }
    
  } else {
    return(<div>{getLogin()}</div>);
  }
  
   
}

export default Create;
