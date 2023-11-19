import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { PdfReader } from "pdfreader";
import http from "http";
import express from 'express';

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