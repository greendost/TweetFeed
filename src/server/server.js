const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const tweetController = require("./tweetController");
const uuidv4 = require("uuid/v4");
const mustacheExpress = require("mustache-express");
const redisClient = require("./redisConnection");

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "PRODUCTION" || false;
const NUM_MINUTES_FOR_SESSION = process.env.TIMEOUT || 15;
const loginDelaySeconds = process.env.LOGIN_DELAY_SECONDS || 5;

app.use(function(req, res, next) {
  console.log("\nTwitter Feed app: " + req.path);
  next();
});

app.use(express.static("public"));
if (!isProduction) {
  const webpack = require("webpack");
  // const config = require(path.resolve(process.cwd(), 'webpack.config.js'));
  const config = require(path.resolve(process.cwd(), "webpack.dev.js"));
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );

  app.use(require("webpack-hot-middleware")(compiler));
}

// from https://stackoverflow.com/questions/37901568/serving-static-files-in-express-with-mustache-templating
// Register '.html' extension with The Mustache Express
app.engine("html", mustacheExpress());

app.set("view engine", "html");
app.set("views", __dirname + "/html");

// form middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(["/app/*", "/tweet/*"], function(req, res, next) {
  console.log("/app or tweet route");
  if (req.query.key) {
    redisClient.exists(req.query.key, function(err, data) {
      redisClient.ttl(req.query.key, (err, data) => {
        if (data) {
          console.log("ttl=" + data);
        }
      });

      // console.log(`req.query.key=${req.query.key} data=${data}`);
      if (!err) {
        if (data) {
          next();
        } else {
          res.status(401).json({ errMsg: "Your session has expired" });
        }
      } else {
        res.status(400).json({ errMsg: err });
      }
    });
  } else {
    res.status(400).json({ errMsg: "We did not find a key" });
  }
});

// setup tweet router
app.use("/tweet", tweetController.router);
// get twitter token
tweetController.getTwitterBearerToken();

// --- routes ----------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  var key = uuidv4();
  res.render("login", { key });
});

app.get("/loginkey", (req, res) => {
  setTimeout(function() {
    var key = uuidv4();
    if (NUM_MINUTES_FOR_SESSION == -1) {
      redisClient.set(key, "value");
    } else {
      redisClient.set(key, "value", "EX", 60 * NUM_MINUTES_FOR_SESSION);
    }

    res.status(200).json({ key });
  }, loginDelaySeconds * 1000);
});

app.post("/mainapp", (req, res) => {
  // console.log('/app req.body=' + JSON.stringify(Object.keys(req.body)));
  console.log("mainapp/* post request");
  if (redisClient.exists(req.body.loginKey)) {
    res.render("index", { key: req.body.loginKey });
  } else {
    res.redirect("/login");
  }
});

app.get(["/mainapp", "/mainapp/*"], (req, res) => {
  console.log("/mainapp/ or /mainapp/*");
  res.render("index", { key: "" });
});

// --- api -------------------------------------------------
app.get("/app/timeleft", function(req, res) {
  res.json({ timeLeft: redisClient.ttl(req.query.key) });
});

app.post("/app/adduser", function(req, res) {
  // console.log('adduser req.body=' + JSON.stringify(req.body));

  if (req.body.screen_name) {
    if (/q=/.test(req.body.screen_name)) {
      // res.sendStatus(200);
      res.status(200).json({ errorMsg: "" });
    } else {
      // verify user
      tweetController.getUser(req.body.screen_name, [
        req,
        res,
        () => {
          // res.sendStatus(200);
          res.status(200).json({ error: "" });
        }
      ]);
    }
  } else {
    res.status(400).end();
  }
});

app.listen(port, () => {
  console.log("\ntimestamp " + new Date().toString());
  console.log("listening on port " + port);
});
