import React, {useState} from 'react';

import {Router, Route, Switch, Redirect} from "react-router-dom";
import { createBrowserHistory } from 'history';

import Upload from "./Upload";
//import Create from "./Create";
import Join from "./Join";
import Room from "./Room";
import NotFound from "./NotFound";

import firebase from "./firebase";

import "../assets/css/quiz.css";

require('dotenv').config();

function AppRouter(props){

    const [roomData, setRoomData] = useState(null);
    const [questionData, setQuestionData] = useState(null);
    const [authenticated, setAuthenticated] = useState(null);

    const [roomList, setRoomList] = useState(null);

    const history = createBrowserHistory();

    const getRoomData = async(code) => {
        /* Read data from database */

        let firebaseData = await firebase.database().ref('/');

        firebaseData.on('value', (snapshot) =>{
            const foundData = snapshot.val();

            let rooms = foundData.Rooms;

            if(!rooms) setRoomData(false); //Error

            if(rooms[code]){
                setRoomData(rooms[code]);
            } else {
                setRoomData(false);
            }
        });
    }

    const getRoomList = () => {
        let firebaseData =  firebase.database().ref('/');

        firebaseData.on('value', (snapshot) =>{
            const foundData = snapshot.val();

            let rooms = foundData.Rooms;

            if(rooms)
                setRoomList(Object.keys(rooms));            
        });
    }

    const getQuestionData = async() => {
       /* Read data from database */

       let firebaseData = await firebase.database().ref('/');

       firebaseData.on('value', (snapshot) =>{
            const foundData = snapshot.val();
 
            let questions = foundData.QuestionList;

            if(!questions) setQuestionData(false); //Error

            setQuestionData(questions);           
       }); 
    }

    
    const overwriteQuestionList = async(newQuestions) => {
        let questionData = firebase.database().ref("/QuestionList/");

        try{
            return await questionData.set(newQuestions);
        } catch {
            return false;
        }
    }

    const updateRoomData = (code, path, newData) => {
        let roomData = firebase.database().ref("/Rooms/" + code + "/" + path);
        
        roomData.set(newData);       
    }

    const redirectUser = () => {
        return(<Redirect to={"/join"} />);
    }

    const authStateChanged = () => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            setAuthenticated(true);
          }
          else {
            setAuthenticated(false);
          }
        });
      }

    const userLogin = async(username, password) => {
        return await firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .then(() => {setAuthenticated(true); return true;})
        .catch(() => {setAuthenticated(false); return false;});
        
    }

    const logoutUser = async () => {
        await firebase.auth().signOut();
        setAuthenticated(false)
      }
    
    return(
        <div id="background">
            <Router history={history}>
                <Switch>
                    <Route exact path = "/">{redirectUser}</Route>
                    <Route path = "/create">
                        {/* <Create 
                            auth={authenticated}
                            getQuestionData={getQuestionData}
                            questionData={questionData}
                            authUpdate={authStateChanged}
                            authLogin={userLogin}
                            authLogout={logoutUser}/> */}
                            <div>Not yet available</div>
                    </Route>
                            
                    <Route path = "/join" history={history}> <Join history={history}/></Route> 
                    <Route path = "/room" history={history}> 
                        <Room 
                            redirectUser={redirectUser}
                            roomData={roomData}
                            getRoomData={getRoomData} 
                            updateRoomData={updateRoomData}
                            history={history}
                            auth={authenticated}
                            authUpdate={authStateChanged}
                            authLogin={userLogin}
                            authLogout={logoutUser}
                            getQuestionData={getQuestionData}
                            questionData={questionData}/>
                    </Route>
                    <Route path="/upload">
                        <Upload 
                            auth={authenticated}
                            authUpdate={authStateChanged}
                            authLogin={userLogin}
                            authLogout={logoutUser}
                            getRoomList={getRoomList}
                            roomList={roomList}
                            updateRoomData={updateRoomData}
                            overwriteQuestionList={overwriteQuestionList}/>
                    </Route>
                    <Route path="/"> <NotFound history={history}/> </Route>
                </Switch>
            </Router>
        </div>
    );
    
}

export default AppRouter;