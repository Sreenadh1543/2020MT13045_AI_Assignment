// in ActionProvider.jsx
import React, { useState, useEffect } from 'react';
import $ from 'jquery';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const handlePrompt = (question) => {
    var fileName = $("#uploaded-file-name").text();
    if(undefined!=fileName && null!=fileName){
        fileName = fileName.replace(".pdf",".csv");
        console.log("File Name in Action Provider "+fileName);
        console.log("message is"+question);
        fetch('http://localhost:9000/getchatResponse',{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "prompt": question,
            "fileName":fileName
          })
        })
        .then((response) => response.json())
        .then((responseData)=> {
          setTimeout(() => {
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
    }
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