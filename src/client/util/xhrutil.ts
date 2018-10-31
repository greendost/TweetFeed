function makeParamString(params: IParams) {
  return Object.keys(params)
    .map(param => param + "=" + params[param])
    .join("&");
}

export interface ICallback {
  (errCode: IErrorCodeOrNull, responseText: string): void;
}

interface IParams {
  [param: string]: string;
}

export interface IOptions {
  params?: IParams;
  postData?: any;
}

interface IErrorCode {
  code: number;
}

export type IErrorCodeOrNull = IErrorCode | null;

class XhrUtil {
  errorCallbacks: any;
  constructor() {
    this.errorCallbacks = null;
  }

  setErrorCallback(serverErrorCode: string, callback: ICallback) {
    if (!this.errorCallbacks) this.errorCallbacks = {};
    this.errorCallbacks[serverErrorCode] = callback;
  }

  get(url: string, callback: ICallback, options: IOptions) {
    if (url.indexOf("?") !== -1)
      throw new Error("Please pass query parameters via options parameter");

    var getUrl = url;
    if (options && options.params) {
      getUrl += "?" + makeParamString(options.params);
    }
    // console.log("getUrl=" + getUrl);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(this: XhrUtil) {
      if (xhr.readyState === 4) {
        var errCode = null;
        var responseText = xhr.responseText;
        if (xhr.status !== 200) {
          console.log("error xhr.status=" + xhr.status);
          errCode = { code: xhr.status };
        }
        if (
          this.errorCallbacks &&
          errCode &&
          this.errorCallbacks[errCode.code]
        ) {
          console.log("error callback");
          this.errorCallbacks[errCode.code]();
          return;
        }
        if (errCode && errCode.code === 0) {
          responseText = `{ "error": { "errorMsg": "Network error"}}`;
        }
        callback(errCode, responseText);
      }
    }.bind(this);
    xhr.open("GET", getUrl);
    xhr.send();
  }

  post(url: string, callback: ICallback, options: IOptions) {
    if (url.indexOf("?") !== -1)
      throw new Error("Please pass query parameters via options parameter");

    var postUrl = url;
    if (options.params) {
      postUrl += "?" + makeParamString(options.params);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(this: XhrUtil) {
      if (xhr.readyState === 4) {
        var errCode: IErrorCodeOrNull = null;
        var responseText = xhr.responseText;
        if (xhr.status !== 200) {
          errCode = { code: xhr.status };
        }
        if (
          this.errorCallbacks &&
          errCode &&
          this.errorCallbacks[errCode.code]
        ) {
          console.log("error callback");
          this.errorCallbacks[errCode.code]();
          return;
        }
        if (errCode && errCode.code === 0) {
          responseText = `{ "error": { "errorMsg": "Network error"}}`;
        }
        callback(errCode, responseText);
      }
    }.bind(this);
    xhr.open("POST", postUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(options.postData);
  }
}

export default XhrUtil;
