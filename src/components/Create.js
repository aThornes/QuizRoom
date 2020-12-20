import React, {useState, useEffect} from 'react';

function Create(props) {  

  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");

  let [selected, setSelected] = useState("");
  let [cSelected, setCSelected] = useState("");

  let [choiceList, setChoiceList] = useState([]);

  let [showErr, setShowErr] = useState(false);

  useEffect(() => {

    /* Check if user auth state needs to be updated */
    props.authUpdate();

    props.getQuestionData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const logUser = (e) => {
    e.preventDefault();

    props.authLogin(user,pass);

    setShowErr(true); //Can just set error to show, if login works then user will not see login option anymore anyway
  }

  const getLogin = () => {
    return(
        <div>
            <form onSubmit={(e) => logUser(e)}>
                <input type="text" name="username" value={user} onChange={(e) => {setUser(e.target.value)}} />
                <input type="password" name="password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
                <button>Go</button>
            </form>
            {showErr ? <div>*Invalid credentials</div> : <></>}
        </div>   
    );
  }

  const addList = (choice) => {
    let localList = choiceList;
    
    if(!localList.includes(choice)) localList.push(choice);      
    
    setChoiceList(localList);
  }

  const delList = (choice) => {
    let localList = choiceList;

    if(localList.includes(choice)){
      let ind = localList.indexOf(choice);

      if(ind && ind > 0) localList.splice(ind, 1);

      setChoiceList(localList);   
    }
  }

  
  if(!props.auth){
    return getLogin();
  } else if(!props.questionData) {
    return <div>Loading...</div>
  } else{    
    // 
    return (
    <div>
      Available
      <div>
        <select name="availableQuestionSets" size={Object.keys(props.questionData).length} value={selected} onChange={(e) => setSelected(e.target.value)}>
          {Object.keys(props.questionData).map((key, i) => {
            return <option key={i} value={key}>{key} ({props.questionData[key].type})</option>
          })}
        </select>
      </div>
      <button onClick={() => addList(selected) }>+</button>
      <button onClick={() => delList(cSelected) }>-</button>
      Selected
      <div>
      <select name="selectedQuestionSets" size={(Object.keys(choiceList).length >=2) ? Object.keys(choiceList).length : 2} value={cSelected} onChange={(e) => setCSelected(e.target.value)}>
          {choiceList.map((key, i) => {
            return <option key={i} value={key}>{key} ({props.questionData[key].type})</option>
          })}
        </select>
      </div>
      <button>Create</button>
    </div>
    );
  }
   
}

export default Create;
