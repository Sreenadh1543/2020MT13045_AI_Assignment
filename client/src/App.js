import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Tabs from "./Tabs";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
        this.tabData = [
            { label: "Tab 1" },
            { label: "Tab 2" },
            { label: "Tab 3" },
        ];
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
                <Tabs tabs={this.tabData} />
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;