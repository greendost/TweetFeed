const express = require('express');
const querystring = require('querystring');
const https = require('https');
// const querystring = require('querystring');
// const crypto = require('crypto');

const router = express.Router();

const TW_CONSUMER_KEY = process.env['TW_CONSUMER_KEY'];
const TW_CONSUMER_SECRET_KEY = process.env['TW_CONSUMER_SECRET_KEY'];

var accessToken = '';
var appState = 'NOT_LOADED'; // NOT_LOADED, PASS, FAIL_TO_GET_TOKEN
const count = 40; // num tweets to retrieve

// --- utility ------------------------------------------------------
function TwitterOptions() {
  this.protocolPrefix = 'https://';
  this.host = 'api.twitter.com';

  // endpoints
  this.bearerTokenData = {
    apiPath: '/oauth2/token',
    method: 'POST'
  };
  // tweets of user
  this.userTimelineData = {
    apiPath: '/1.1/statuses/user_timeline.json',
    method: 'GET'
  };
  this.userShowData = {
    apiPath: '/1.1/users/show.json',
    method: 'GET'
  };
  this.standardSearchData = {
    apiPath: '/1.1/search/tweets.json',
    method: 'GET'
  };

  this.getOptions = function(apiEndpoint, options) {
    var result = {};
    result.host = this.host;
    if (apiEndpoint) {
      result.method = this[apiEndpoint].method;
      result.path = 'https://' + this[apiEndpoint].apiPath;
      if (options && options.queryString)
        result.path += '?' + options.queryString;
    }
    return result;
  };
}

const twOptions = new TwitterOptions();

function createTwitterAppAuthorizationValue() {
  var encodedKey =
    encodeURIComponent(TW_CONSUMER_KEY) +
    ':' +
    encodeURIComponent(TW_CONSUMER_SECRET_KEY);
  encodedKey = Buffer.from(encodedKey).toString('base64');
  return 'Basic ' + encodedKey;
}

// --- routes ---------------------------------------------------------
// log
router.use(function(req, res, next) {
  console.log('tweetController: ' + req.path + ' appState=' + appState);
  next();
});

// get tweets per user
router.get('/get/tweetlist', function(req, res) {
  var result = '';

  // default for user
  var optionType = 'userTimelineData';
  var qs = ['screen_name=' + req.query.screenname, `count=${count}`];
  qs = req.query.tweet_mode
    ? [...qs, `tweet_mode=${req.query.tweet_mode}`]
    : qs;
  qs = qs.join('&');

  // if search query
  if (/q=/.test(req.query.screenname)) {
    // console.log('query identified');
    optionType = 'standardSearchData';
    qs = [encodeURI(req.query.screenname), `count=${count}`].join('&');
  }
  console.log(`qs=${qs}`);
  var req = https.request(
    twOptions.getOptions(optionType, {
      queryString: qs
    }),
    function(twRes) {
      twRes.on('data', chunk => {
        result += chunk;
      });
      twRes.on('end', () => {
        var tweetData = JSON.parse(result);
        // console.log('tweetData=' + JSON.stringify(tweetData));
        var responseData = { error: '', data: [] };
        var status = 200;
        if (!tweetData.errors) {
          if (!Array.isArray(tweetData) && tweetData.statuses) {
            tweetData = tweetData.statuses;
          }
          tweetData.forEach(function(x) {
            responseData.data.push({
              text: x['full_text'],
              created_at: x['created_at'],
              entities: { urls: x['entities']['urls'] },
              id_str: x['id_str']
            });
          });
        } else {
          if (tweetData.errors.code && tweetData.errors.code === 34) {
            status = 404;
            responseData.error = {
              errorMsg: 'Twitter account not found'
            };
          } else {
            status = 500;
            responseData.error = {
              errorMsg: 'Unknown problem with Twitter account'
            };
          }
        }
        res.status(status).json(responseData);
      });
    }
  );
  req.setHeader('Authorization', 'Bearer ' + accessToken);
  req.on('error', e => {
    // console.error(`getTweetlist error: ${e.message}`);
    res.status(500).end();
  });
  req.end();
});

function getUser(screenName, [origReq, origRes, callback]) {
  var result = '';
  var req = https.request(
    twOptions.getOptions('userShowData', {
      queryString: 'screen_name=' + screenName
    }),
    function(twRes) {
      twRes.on('data', chunk => {
        result += chunk;
      });
      twRes.on('end', () => {
        var tweetData = JSON.parse(result);
        var responseData = {};
        var status = 200;
        if (!tweetData.errors) {
          // success case
          callback(origReq, origRes);
        } else {
          if (tweetData.errors.length && tweetData.errors[0].code === 50) {
            status = 404;
            responseData = {
              errorMsg: `Twitter account ${screenName} not found`
            };
          } else {
            status = 500;
            responseData = {
              errorMsg: `Unknown problem with Twitter account ${screenName}`
            };
          }
          origRes.status(status).json(responseData);
        }
      });
    }
  );
  req.setHeader('Authorization', 'Bearer ' + accessToken);
  req.on('error', e => {
    console.error(`getUser error: ${e.message}`);
    origRes.status(500).end();
  });
  req.end();
}

function getTwitterBearerToken() {
  // console.log('authorizationValue=' + authorizationValue);
  var result = '';
  var req = https.request(twOptions.getOptions('bearerTokenData'), function(
    res
  ) {
    res.on('data', chunk => {
      result += chunk;
    });
    res.on('end', () => {
      var data = JSON.parse(result);
      if (!data.errors) {
        accessToken = data.access_token;
        appState = 'PASS';
        // console.log('accessToken retrieved: ' + accessToken);
      } else {
        appState = 'FAIL_TO_GET_TOKEN';
      }
    });
  });

  req.setHeader('Authorization', createTwitterAppAuthorizationValue());
  req.setHeader(
    'Content-Type',
    'application/x-www-form-urlencoded;charset=UTF-8'
  );
  req.write('grant_type=client_credentials');

  req.on('error', e => {
    console.error(`getTwitterBearerToken error: ${e.message}`);
    res.status(500).end();
  });
  req.end();
}

module.exports = {
  router,
  getTwitterBearerToken,
  getUser
};
