import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';

import 'react-chatbot-kit/build/main.css';

function ChatGpt(){
    return (
       <div>
         <h2>Simple Chat bot Integrated with OPEN Ai Api's </h2>
         <h2>Text-Davinci-003</h2>
         <div className="chatbot">
             <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}/>
        </div>
       </div>
    );

}

export default ChatGpt;