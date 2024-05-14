// request.js
const https = require("https");
const querystring = require("querystring");

function doCall(url, headers, params, method) {
  return new Promise((resolve, reject) => {
    const options = { method, headers };
    const queryString = querystring.stringify(params);

    console.log("Request URL:", url);
    console.log("Request Headers:", headers);
    console.log("Request Params:", queryString);

    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", (e) => reject(e));
    req.setHeader("Content-Length", Buffer.byteLength(queryString));
    req.write(queryString);
    req.end();
  });
}

module.exports = { doCall };
