const fs = require('fs');

var db = {};
var dbPath = '';

function init(pathToDb, initData) {
  dbPath = pathToDb;
  data = initData ? initData : db;
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(data));
  }
  readSync();
}

function readSync() {
  db = JSON.parse(fs.readFileSync(dbPath));
  // console.log(JSON.stringify(db));
}

function save(callback) {
  fs.writeFile(dbPath, JSON.stringify(db), callback);
}

function getObject() {
  return db;
}

module.exports = {
  init: init,
  save: save,
  getObject: getObject
};
