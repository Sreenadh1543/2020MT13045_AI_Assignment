import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import { useRef } from "react";
import { useState } from "react";
import Button from "react";



export const SingleEmbedding = ({}) => {

  const [fileName, setFileName] = useState("");
  const [pdf, setPdf] = useState({ preview: '', data: '' })
  const [status, setStatus] = useState('')

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
      <h2>Domain Specific With Single Document !</h2>
      <h2>Text-Embedding-ada-002</h2>
      <br/>
      <br/>
      <h3 onClick={()=>window.open('https://drive.google.com/drive/folders/1kwQPPTDBO7_0aU6-F_Q5RUrUuzp8bNR6?usp=drive_link',
      '_blank', 'rel=noopener noreferrer')}>Sample pdf documents created for testing .... click here</h3>
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
        <h3>Upload Single Pdf for embedding</h3> <br />
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
      </form>
      <h3>Uploaded file:</h3>
      {fileName ? <p id="uploaded-file-name" style={{ paddingTop :30}}>{fileName}</p> : null}
      <br/>
      Some Sample Single Page Pdf's are provided in the zip submitted for assignment
      <br/>
      {status ?<p style={{ paddingTop :20}}><h3>Service Response :</h3>{status}</p> : null}
      <br/>
      <p style={{ paddingTop :20}}><h3>Note :</h3>Please limit to upload only a <b>Single page Pdf</b>, there is a rate limit of 
      only 3 requests for embeddings for a free reqeust and i did a chunking of data only into 3 parts to meet it</p>
    </>
  );

};

export default SingleEmbedding;