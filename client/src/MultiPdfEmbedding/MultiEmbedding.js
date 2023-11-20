import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import { useRef } from "react";
import { useState } from "react";
import RadioInput from "react";



export const MultiEmbedding = ({}) => {

  const [fileName, setFileName] = useState("");
  const [pdf, setPdf] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')
  const [fileNames, setFileNames] = useState([]);

  const handleFile = (file) => {
    setFileName(file.name);
  };

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', pdf.data)
    formData.append('name', pdf.name)
    fetch('http://localhost:9000/pdfupload', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
    .then((responseData)=> {
      console.log(responseData);
      setStatus(responseData.message);
      setFileNames(fileNames => [...fileNames, pdf.name]);
    }).catch((error) =>{
      setStatus("Error In Creating CSV with tokens");  
    });

  };

  const handleChange = (e) => {
      var file = e.target.files[0];
      console.log(file);
      handleFile(file);
      const pdf = {
        data: file,
        name: file.name
      }
      setPdf(pdf)
    };

  return (
    <>
         <h2>Simple Chat bot Integrated with OPEN Ai Api's </h2>
         <h2>Domain Specific With Multi Document !</h2>
         <h2>Text-Embedding-ada-002</h2>
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
          paddingTop :30,
          margin: 'auto',
          width: 400,
          flexWrap: 'wrap',
        }}>
      <div style={{  paddingTop :50 ,width: '100%', float: 'left' }}>
        <h3>Upload file for embedding</h3> <br />
      </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          ref={hiddenFileInput}/>
            <div style={{
                    paddingTop :30
                  }}>
            <button className="button-upload">
                Upload
            </button>
            </div>
            <br/>
            <h4>File Selected for upload :</h4>
            {fileName ? <p id="uploaded-file-name" style={{ paddingTop :10}}>{fileName}</p> : null}
      </form>
      <br/>
      <>
        <form style={{ paddingTop :10}}>
          <h2>Uploaded file (s):</h2>
          {fileNames.map((fileName, index) => (
            <div>
            <label key={index}>
              <input
                value={fileName}
                checked={false}
                type="radio"
              />
                {fileName}
            </label>
            </div>
          ))}
        </form>
      </>
      <br/>
      {status ?<p style={{ paddingTop :20}}><h3>Service Response :</h3>{status}</p> : null}
    </>
  );

};

export default MultiEmbedding;