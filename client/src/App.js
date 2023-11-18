import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Welcome from "./Welcome";
import SimpleChatBot from "./simpleChatBot/SimpleChatBot";
import SingleEmbedding from "./singlepdf/SingleEmbedding";
import MultiEmbedding from "./MultiEmbedding";
import ChatGpt from "./openAi-textdavinci/ChatGpt";
import NavBar from "./NavigationBar";
import {Routes,Route,Link} from 'react-router-dom';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: "Backend Server is not started" };      
    }

    callAPI() {
        fetch("http://localhost:9000/testApi")
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res.message }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    

    render() {
        return (
            <div className="App">
                
                <NavBar></NavBar>
                <h3 className="App-intro">{this.state.apiResponse}</h3>
                <Routes>
                    <Route exact path="/" Component={Welcome}/>
                    <Route exact path="/simplechatbot" Component={SimpleChatBot}/>
                    <Route exact path="/chatgpt" Component={ChatGpt}/>
                    <Route exact path="/single-embedding" Component={SingleEmbedding}/>
                    <Route exact path="/multi-embedding" Component={MultiEmbedding}/>
                </Routes>
                <br/>
                <br/>
              
            </div>
        );
    }
}

export default App;    ;