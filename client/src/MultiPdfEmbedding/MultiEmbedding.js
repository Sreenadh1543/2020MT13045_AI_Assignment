import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import { useRef } from "react";
import { useState } from "react";



export const MultiEmbedding = ({}) => {

  const [fileName, setFileName] = useState("");
  const [pdf, setPdf] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')
  const [fileNames, setFileNames] = useState([]);
  const [radioSelected, setRadioSelected] = useState("");

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
      setRadioSelected(pdf.name);
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

   const handleRadiochange=(e) =>{
      const value = e.target.value;
      console.log(value);
      setRadioSelected(value);
    }

  return (
    <>
        <div>
          <h3>Upload Many pdf's select a single pdf for chat among them and set context</h3>
          <br></br>
          <h2>Simple Chat bot Integrated with OPEN Ai Api's </h2>
          <h2>Domain Specific With Multi Document !</h2>
          <h2>Text-Embedding-ada-002</h2>
          <br/>
          <h3 onClick={()=>window.open('https://drive.google.com/drive/folders/1kwQPPTDBO7_0aU6-F_Q5RUrUuzp8bNR6?usp=drive_link',
      '_blank', 'rel=noopener noreferrer')}>Sample pdf documents created for testing .... click here</h3>
        </div>
        <div className="bot-to-left">
        <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}/>
       </div>
       <div style={{
          display: 'flex',
          float: 'left',
          position: 'relative',
          paddingLeft:50,
          paddingTop :100,
          margin: 'auto',
          width: 400,
          flexWrap: 'wrap',
        }}>
       <br/>
       <br/>
      <h3>Upload file for embedding</h3>
       <br />
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
            {fileName ? <p style={{ paddingTop :10}}>{fileName}</p> : null}
      </form>
      <br/>
      {status ?<p style={{ paddingTop :20}}><h3>Service Response :</h3>{status}</p> : null}
      <h3 style={{ paddingLeft:30,paddingTop :20}} >Selected File for Chat :</h3>
      <br></br>
      <div>
        {radioSelected ?<p id="uploaded-file-name" style={{ paddingTop :20}}>{radioSelected}</p> : null}
      </div>
      </div>
      <br/>
      <>
        <div style={{ paddingTop :150}}>
          <h4>Uploaded file (s):</h4>
          <p>Select one of the files to Set the content for chat </p>
          <div style={{ paddingTop :20}}>
          {fileNames.map((fileName, index) => (
            <div>
            <label key={index}>
              <input
                value={fileName}
                checked= {radioSelected===fileName}
                onChange={handleRadiochange}
                type="radio"/>
                {fileName}
            </label>
            </div>
          ))}
          </div>
        </div>
      </>
    </>
  );

};

export default MultiEmbedding;