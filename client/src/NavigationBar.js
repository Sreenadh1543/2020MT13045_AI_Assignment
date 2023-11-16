import React from "react";
import {Link} from 'react-router-dom';

function NavBar(){

    return(
        <header>
        <h4 class="mainmaneheader">Click On Links At Right</h4>
        <ul>
            <li><h4><Link to="/">Welcome</Link></h4></li>
            <li><h4><Link to="/simplechatbot">SimpleChatBot - Random Responses</Link></h4></li>
            <li><h4><Link to="/chatgpt">SimpleChatBot - Integrated With Chat Gpt</Link></h4></li>
            <li><h4><Link to="/single-embedding">Single document embedding</Link></h4></li>
            <li><h4><Link to="/multi-embedding">Multi Document Embedding</Link></h4></li>
        </ul>
       </header>
    );
}

export default NavBar;