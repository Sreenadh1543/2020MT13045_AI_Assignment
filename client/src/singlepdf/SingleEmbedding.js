import React , {Component} from "react";
import Chatbot from 'react-chatbot-kit';
import config from '../Config.js';
import ActionProvider from './ActionProvider.js';
import MessageParser from './MessageParser.js';
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';


function SingleEmbedding(){
    return (
      <div>
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
      <input type="file" accept="application/pdf" style={{ display: 'none' }} id="contained-button-file" />
      <label style={{paddingLeft:150}} htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
         </div>
       </div>
    );

}

export default SingleEmbedding;