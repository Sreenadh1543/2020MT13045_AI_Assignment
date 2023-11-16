import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Welcome from "./Welcome";
import SimpleChatBot from "./SimpleChatBot";
import SingleEmbedding from "./SingleEmbedding";
import MultiEmbedding from "./MultiEmbedding";
import ChatGpt from "./ChatGpt";
import NavBar from "./NavigationBar";
import {Routes,Route,Link} from 'react-router-dom';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };      
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    

    render() {
        return (
            <div className="App">
                <NavBar></NavBar>
                <Routes>
                    <Route exact path="/" Component={Welcome}/>
                    <Route exact path="/simplechatbot" Component={SimpleChatBot}/>
                    <Route exact path="/chatgpt" Component={ChatGpt}/>
                    <Route exact path="/single-embedding" Component={SingleEmbedding}/>
                    <Route exact path="/multi-embedding" Component={MultiEmbedding}/>
                </Routes>
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;    ;