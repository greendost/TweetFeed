// TweetFeed specific app request

import XhrUtil from "./xhrutil";
import { ICallback, IOptions } from "./xhrutil";

const xhrutil = new XhrUtil();
const loginKey = document.getElementById("loginKey")!.innerHTML;

// token expired
xhrutil.setErrorCallback(401, function() {
  window.location.href = "/login";
});

function get(url: string, callback: ICallback, options: IOptions) {
  if (!options.params) options.params = {};
  options.params.key = loginKey;
  xhrutil.get(url, callback, options);
}

function post(url: string, callback: ICallback, options: IOptions) {
  if (!options.params) options.params = { key: loginKey };
  xhrutil.post(url, callback, options);
}

export default { get, post };
