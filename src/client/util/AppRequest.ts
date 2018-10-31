// TweetFeed specific app request

import XhrUtil from "./xhrutil";
import { ICallback, IOptions } from "./xhrutil";
import { storageAvailable } from "./util";

const xhrutil = new XhrUtil();

function getLoginKey() {
  const loginKey = document.getElementById("loginKey")!.innerHTML;
  return loginKey;
}

// token expired
xhrutil.setErrorCallback("401", function() {
  if (storageAvailable("sessionStorage")) sessionStorage.removeItem("loginKey");
  window.location.href = "/login";
});

// e.g. no key, such as on refresh of page
function errorValidation() {
  if (storageAvailable("sessionStorage")) sessionStorage.removeItem("loginKey");
  window.location.href = "/login";
}

function updateOptions(options: IOptions) {
  if (!options.params) options.params = {};

  const loginKey = getLoginKey();
  if (!loginKey) {
    errorValidation();
  }
  options.params.key = loginKey;

  return options;
}

function get(url: string, callback: ICallback, options: IOptions) {
  const updatedOptions = updateOptions(options);
  xhrutil.get(url, callback, updatedOptions);
}

function post(url: string, callback: ICallback, options: IOptions) {
  const updatedOptions = updateOptions(options);
  xhrutil.post(url, callback, updatedOptions);
}

export default { get, post };
