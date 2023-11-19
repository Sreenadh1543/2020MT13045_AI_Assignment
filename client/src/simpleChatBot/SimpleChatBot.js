import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';


function SimpleChatBot(){
    return (
       <div>
         <h2>Simple Chat bot with Random Responses!</h2>
         <div className="chatbot">
             <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}/>
        </div>
       </div>
    );

}

export default SimpleChatBot;