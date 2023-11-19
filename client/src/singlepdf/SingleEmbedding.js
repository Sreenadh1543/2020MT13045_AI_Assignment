import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import { useRef } from "react";
import { useState } from "react";


export const SingleEmbedding = ({}) => {
  const [fileName, setFileName] = useState("");
  
  const handleFile = (file) => {
    setFileName(file.name);
  };

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileName);
    handleFile(fileUploaded);
  };
  return (
    <>
    <div>
          <h1>Simple Chat bot Integrated with OPEN Ai Api's </h1>
          <h1>Domain Specific With Single Document !</h1>
          <h1>Text-Embedding-ada-002</h1>
        </div>
        <div className="bot-to-left">
        <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}/>
       </div>
       <div style={{
          display: 'flex',
          float: 'center',
          position: 'relative',
          paddingTop :100,
          margin: 'auto',
          width: 400,
          flexWrap: 'wrap',
        }}>
      <div style={{ width: '100%', float: 'left' }}>
        <h3>Upload Single Pdf for embedding</h3> <br />
      </div>
      </div>
      <button className="button-upload" onClick={handleClick}>
        Upload a file
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: "none" }} // Make the file input element invisible
      />
      {fileName ? <p>Uploaded file: {fileName}</p> : null}
    </>
  );
};

export default SingleEmbedding;