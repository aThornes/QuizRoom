import React, {useState} from 'react';

import {Router, Route, Switch, Redirect} from "react-router-dom";
import { createBrowserHistory } from 'history';

import Create from "./Create";
import Join from "./Join";
import Room from "./Room";
import NotFound from "./NotFound";

import firebase from "./firebase";

import "../quiz.css";

require('dotenv').config();

function AppRouter(props){

    const [roomData, setRoomData] = useState(null);
    const [questionData, setQuestionData] = useState(null);
    const [authenticated, setAuthenticated] = useState(null);

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

    const userLogin = (username, password) => {
        firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .then(setAuthenticated(true))
        .catch(setAuthenticated(false));
    }

    const logoutUser = async () => {
        await firebase.auth().signOut();
        setAuthenticated(false)
      }
    
    return(
            <Router history={history}>
                <Switch>
                    <Route exact path = "/">{redirectUser}</Route>
                    <Route path = "/create"><Create 
                            auth={authenticated}
                            getQuestionData={getQuestionData}
                            questionData={questionData}
                            authUpdate={authStateChanged}
                            authLogin={userLogin}
                            authLogout={logoutUser}/></Route>
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
                    <Route> <NotFound /> </Route>
                </Switch>
            </Router>
    );
    
}

export default AppRouter;