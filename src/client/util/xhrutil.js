function makeParamString(params) {
  return Object.keys(params)
    .map(param => param + '=' + params[param])
    .join('&');
}

class XhrUtil {
  constructor() {
    this.errorCallbacks = null;
  }

  setErrorCallback(serverErrorCode, callback) {
    if (!this.errorCallbacks) this.errorCallbacks = {};
    this.errorCallbacks[serverErrorCode] = callback;
  }

  get(url, callback, options) {
    if (url.indexOf('?') !== -1)
      throw new Error('Please pass query parameters via options parameter');

    var getUrl = url;
    if (options && options.params) {
      getUrl += '?' + makeParamString(options.params);
    }
    console.log('getUrl=' + getUrl);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var errCode = null;
        if (xhr.status !== 200) {
          console.log('error xhr.status=' + xhr.status);
          errCode = { code: xhr.status };
        }
        if (
          this.errorCallbacks &&
          errCode &&
          this.errorCallbacks[errCode.code]
        ) {
          console.log('error callback');
          this.errorCallbacks[errCode.code]();
          return;
        }
        callback(errCode, xhr.responseText);
      }
    }.bind(this);
    xhr.open('GET', getUrl);
    xhr.send();
  }

  post(url, callback, options) {
    if (url.indexOf('?') !== -1)
      throw new Error('Please pass query parameters via options parameter');

    var postUrl = url;
    if (options.params) {
      postUrl += '?' + makeParamString(options.params);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var errCode = null;
        if (xhr.status !== 200) {
          errCode = { code: xhr.status };
        }
        if (
          this.errorCallbacks &&
          errCode &&
          this.errorCallbacks[errCode.code]
        ) {
          console.log('error callback');
          this.errorCallbacks[errCode.code]();
          return;
        }
        callback(errCode, xhr.responseText);
      }
    }.bind(this);
    xhr.open('POST', postUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(options.postData);
  }
}

// function get(url, callback, options) {
//   var getUrl = url;
//   if (options && options.params) {
//     getUrl += '?' + makeParamString(options.params);
//   }
//   console.log('getUrl=' + getUrl);
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       var errCode = null;
//       if (xhr.status !== 200) {
//         errCode = xhr.status;
//       }
//       if(this.errorCallbacks && this.errorCallbacks[errCode]) {
//         this.errorCallbacks[errCode]();
//         return;
//       }
//       callback(errCode, xhr.responseText);
//     }
//   };
//   xhr.open('GET', getUrl);
//   xhr.send();
// }
//
// function post(url, callback, options) {
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       var errCode = null;
//       if (xhr.status !== 200) {
//         errCode = xhr.status;
//       }
//       callback(errCode, xhr.responseText);
//     }
//   };
//   xhr.open('POST', url);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(options.postData);
// }

// export default { get, post };

export default XhrUtil;
