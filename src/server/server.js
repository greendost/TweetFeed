const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const tweetController = require('./tweetController');
const jsonDB = require('./jsondbController');
const sqlite = require('sqlite');
const uuidv4 = require('uuid/v4');
const mustacheExpress = require('mustache-express');
const redisClient = require('./redisConnection');

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'PRODUCTION' || false;
const NUM_MINUTES_FOR_SESSION = process.env.TIMEOUT || 15;

app.use(function(req, res, next) {
  console.log('\nTwitter Feed app: ' + req.path);
  next();
});

app.use(express.static('public'));
if (!isProduction) {
  const webpack = require('webpack');
  const config = require(path.resolve(process.cwd(), 'webpack.config.js'));
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );

  app.use(require('webpack-hot-middleware')(compiler));
}

// from https://stackoverflow.com/questions/37901568/serving-static-files-in-express-with-mustache-templating
// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/html');

// form middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(['/app/*', '/tweet/*'], function(req, res, next) {
  console.log('/app or tweet route');
  if (req.query.key) {
    redisClient.exists(req.query.key, function(err, data) {
      redisClient.ttl(req.query.key, (err, data) => {
        if (data) {
          console.log('ttl=' + data);
        }
      });

      console.log(`req.query.key=${req.query.key} data=${data}`);
      if (!err) {
        if (data) {
          next();
        } else {
          res.status(401).json({ errMsg: 'Your session has expired' });
        }
      } else {
        res.status(400).json({ errMsg: err });
      }
    });
  } else {
    res.status(400).json({ errMsg: 'We did not find a key' });
  }
});

app.use('/tweet', tweetController.router); // Network fetch

// db
// var db1 = [{ screen_name: 'greendost' }, { screen_name: 'kentcdodds' }];
// jsonDB.init('./db/tweetfeedlist.json', { feedList: [] });
// console.log(`starting up jsonDB.obj=` + JSON.stringify(jsonDB.obj));
// console.log(
//   `starting up: jsonDB.getObject()=` + JSON.stringify(jsonDB.getObject())
// );

tweetController.getTwitterBearerToken();

// --- routes ----------------------------------------------
app.get('/', (req, res) => {
  console.log('root');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  // res.status(200).sendFile(path.resolve(__dirname, '../../public/login.html'));
  // res.status(200).sendFile(path.resolve(__dirname, 'html/login.html'));
  var key = uuidv4();
  res.render('login', { key });
});

app.get('/loginkey', (req, res) => {
  setTimeout(function() {
    var key = uuidv4();
    if (NUM_MINUTES_FOR_SESSION == -1) {
      console.log('extended session');
      redisClient.set(key, 'value');
    } else {
      redisClient.set(key, 'value', 'EX', 60 * NUM_MINUTES_FOR_SESSION);
    }

    res.status(200).json({ key });
  }, 1000);
});

app.post('/mainapp', (req, res) => {
  console.log('/app req.body=' + JSON.stringify(Object.keys(req.body)));

  if (redisClient.exists(req.body.loginKey)) {
    res.render('index', { key: req.body.loginKey });
  } else {
    res.redirect('/login');
  }
});

// --- api -------------------------------------------------
// app.all('/app/*', function(req, res, next) {
//   console.log('/app route');
//   if (req.query.key && redisClient.exists(req.query.key)) {
//     next();
//   } else {
//     res.status(401).json({ errMsg: 'Your session has expired' });
//   }
// });

app.get('/app/timeleft', function(req, res) {
  res.json({ timeLeft: redisClient.ttl(req.query.key) });
});

app.get('/app/userlist', function(req, res) {
  console.log('user list called');

  res.json(jsonDB.getObject());
});

app.post('/app/adduser', function(req, res) {
  console.log('adduser req.body=' + JSON.stringify(req.body));

  if (req.body.screen_name) {
    if (/q=/.test(req.body.screen_name)) {
      res.sendStatus(200);
    } else {
      // verify user
      tweetController.getUser(req.body.screen_name, [
        req,
        res,
        () => {
          // db1.push({ screen_name: req.body.screen_name });
          // jsonDB
          //   .getObject()
          //   ['feedList'].push({ screen_name: req.body.screen_name });
          // jsonDB.save(() => res.sendStatus(200));
          res.sendStatus(200);
        }
      ]);
    }
  } else {
    console.log('adduser 400');
    res.status(400).end();
  }
});

app.post('/app/deleteuser', function(req, res) {
  console.log('deleteuser req.body=' + JSON.stringify(req.body));

  if (req.body.screen_name) {
    var index = -1;
    jsonDB.getObject()['feedList'].forEach((x, i) => {
      if (x.screen_name === req.body.screen_name) index = i;
    });
    if (index !== -1) {
      jsonDB.getObject()['feedList'].splice(index, 1);
      jsonDB.save(() => res.sendStatus(200));
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log('\ntimestamp ' + new Date().toString());
  console.log('listening on port ' + port);
});

async function migrate() {
  try {
    // debug('opening database');
    console.log('opening database');
    await sqlite.open('./db/tweetfeed.sqlite');
    // debug('updating');
    console.log('updating');
    // await db.migrate({
    //     force: 'last',
    //     './db/migrations/'
    // })
    // debug("SUCCESS !")
  } catch (e) {
    // debug('ERROR - ', e);
    throw e;
  }
}

async function initDB() {
  try {
    await migrate();
  } catch (e) {
    console.error(e);
  }
}

initDB();
