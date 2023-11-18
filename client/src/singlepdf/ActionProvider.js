// in ActionProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { json } from 'react-router-dom';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const handlePrompt = (message) => {
    console.log("message is"+message);
    fetch('http://localhost:9000/ask',{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "prompt": message
      })
    })
    .then((response) => response.json())
    .then((responseData)=> {
      setTimeout(() => {
        console.log("data in messages "+ responseData.message)
        const botMessage = createChatBotMessage(responseData.message);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }, 1000);
    }).catch((error) =>{
      const botMessage = createChatBotMessage("Unable to connect with open AI, May be backend is down?");
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
    });
  };


  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handlePrompt,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;