import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import multer from "multer";
import http from "http";
import express from 'express';
import fs from 'fs';
import pdf from 'pdf-parse';
import * as path from 'path';
import csvWriter from 'csv-writer';


var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const configuration = new Configuration({
    apiKey: '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',
  });

const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pdf/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/pdfupload', upload.single('file'), function (req, res) {
   console.log("-----------------------------------------------");
   var file = req.file;
   console.log(file);
   console.log("-----------------------------------------------");
    if(file!=undefined){
        var fileName = file.filename;
        console.log("file Name is "+fileName);
        if(fs.existsSync("./pdf/"+fileName)){
          console.log("======file Exists======");
          let dataBuffer = fs.readFileSync("./pdf/"+fileName);
          pdf(dataBuffer).then(function(data) {
             if(data!=undefined){
                var pages = data.numpages;
                if(pages!=1){
                  return res.status(200).json({
                    success: true,
                    message: "Only One Page is allowed for this implementation",
                  });
                }
                var pdf = data.text;
                if(pdf!=undefined && pdf.length>30){
                  //MergeLInes to single paragraph
                  const lines = pdf.split("\n");
                  const concatenatedFileText = lines.join("").trim().replace(/\s+/g," ");
                  console.log("======Concatenated File Text======");
                  console.log(concatenatedFileText);
                  console.log("======Concatenated File Text======");
                  if(undefined!=concatenatedFileText && concatenatedFileText.length>0){
                      const textLength = concatenatedFileText.length;  
                      // Create chunks of data
                      const chunkSize = textLength/3; 
                      console.log("Chunk Size "+chunkSize);
                      // Chunk Size is divided by 3 As only 3 calls are allowed per minute
                      const chunks = createchunks(concatenatedFileText,chunkSize);
                      console.log("Chunks Length is "+chunks.length);
                      //Use Chunks to get vector responses
                      var result=getVerctorResponsesAndStoreAsCsv(chunks,fileName);
                      //console.log(result);
                      if(result){
                        return res.status(200).json({
                          success: true,
                          message: "Embeddings are created as CSV Under API/Excel_Vector_Store folder you can chat now",
                        });
                      }else{
                        return res.status(200).json({
                          success: false,
                          message: "Unable To Create Embeddings for CSV",
                        });
                      }
                  }
                }else{
                  return res.status(200).json({
                    success: true,
                    message: "PDF text is less than 30 Characters or no text is available",
                  });
                }
             }else{
              return res.status(200).json({
                success: true,
                message: "Unable to retrieve data from PDF",
              });
             }
          })
          .catch(function(error){
            return res.status(200).json({
              success: true,
              message: "Unable to retrieve data from PDF",
            });
          })
    }
   }
})

function createchunks(inputText,chunksize){
  const chunks = [];
  let i =0;
  while(i<inputText.length){
      chunks.push(inputText.slice(i,i+chunksize));
      i+=chunksize;
  }
  return chunks; 
}

   async function getVerctorResponsesAndStoreAsCsv(chunks,fileName){
    var vectorResponses = [];
    for(let index=0;index<chunks.length;index++){
      const chunk = chunks[index];
      console.log("============Service Called=============");
      console.log("Chunk Text "+chunk);
        try{
          var vectorResponse = await callEmbeddingService(chunk,index);
          /*var vectorResponse = {
            index:0,
            embeddings:"Some Embeddings",
            tokens:80,
            inputText:"Some Text"
          };*/
          vectorResponses.push(vectorResponse);
      }catch(err){
        console.log(err);
      }
      console.log("============Service Called=============");
    }
    console.log("============Vector Tokens=============");

    /*
    Promise.all(vectorResponses).then(function (values) {
      console.log(values);
      console.log("============Vector Tokens=============");
      console.log("============Storing Vector Tokens as Excel =============");
      fileName=fileName.replace(".pdf","");
      console.log("file name is >>",fileName);
      const writer = csvWriter.createObjectCsvWriter({
        path: path.resolve('./excel_Vector_Store', fileName+'.csv'),
        header: [
          { id: 'index', title: 'Index' },
          { id: 'embeddings', title: 'Embeddings' },
          { id: 'tokens', title: 'Tokens' },
          { id: 'inputText', title: 'InputText' },
        ],
      });
      writer.writeRecords(vectorResponses).then(() => {
        console.log('Excel Created');
      });
    });*/

    return vectorResponses;
  }

  async function callEmbeddingService(chunk,index){
    var result = {};
    return new Promise((resolve) => {
        openai.createEmbedding({
              model:"text-embedding-ada-002",
              input: chunk,
        })
        .then((res) => {
          result = {
              index:index,
              embeddings:res.data["data"][0]["embedding"],
              tokens:res.data["usage"].total_tokens,
              inputText:chunk
            };
            console.log(result);
            return result;
        });
        setTimeout(() => {
            resolve(result);
        },1000);
    });
  }

app.get("/testApi", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend is up and running on 9000 port",
  });
});

app.post("/ask", async (req, res) => {
    const prompt = req.body.prompt;
    try {
      if (prompt == null) {
        throw new Error("Uh oh, no prompt was provided");
      }
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
      });
      const completion = response.data.choices[0].text;
      return res.status(200).json({
        success: true,
        message: completion,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  /**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}