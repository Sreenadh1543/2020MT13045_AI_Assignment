

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
// import modules from OpenAI library
const { Configuration, OpenAIApi } = require("openai");
var indexRouter = require("./routes/index");


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;