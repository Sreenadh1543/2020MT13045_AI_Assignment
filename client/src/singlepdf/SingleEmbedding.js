import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import { useRef } from "react";
import { useState } from "react";
import FileReader from "react-file-reader";



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
    const response = await fetch('http://localhost:9000/pdfupload', {
      method: 'POST',
      body: formData,
    })
    if (response) setStatus(response.statusText)
  }
  const handleChange = (e) => {
    var file = e.target.files[0];
    console.log(file);
    handleFile(file)
    const pdf = {
      data: file,
      name: file.name
    }
    setPdf(pdf)
  }
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
                Submit
            </button>
            </div>
      </form>
      {fileName ? <p style={{
                    paddingTop :30
                  }}>Uploaded file: {fileName}</p> : null}
    </>
  );
};

export default SingleEmbedding;