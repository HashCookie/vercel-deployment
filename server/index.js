const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const uuid = require("uuid");
const https = require("https");
const querystring = require("querystring");

const app = express();
app.use(cors());
app.use(express.json());

const APP_KEY = "62c2cdf10e77d810";
const APP_SECRET = "OIQC0HxQzq0dT7ItonlA7z1DMTYFdGxp";
const API_URL = "https://openapi.youdao.com/v2/correct_writing_text";
const PORT = 3000;

app.post("/score", async (req, res) => {
  const { essay, grade = "cet4", title } = req.body;

  // 打印用户输入的作文和题目到控制台
  // console.log("Received essay: ", essay);
  // console.log("Received title: ", title);

  const data = { q: essay, grade: grade, title: title };
  addAuthParams(APP_KEY, APP_SECRET, data);
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const responseText = await doCall(API_URL, headers, data, "POST");
    const responseDict = JSON.parse(responseText);
    console.log("Response: ", responseDict);
    if (responseDict.errorCode === "0") {
      const totalScore = responseDict.Result.totalScore;
      res.json({ totalScore });
    } else {
      console.error(`API Error: ${responseDict.errorCode} ${responseDict.msg}`);
      res.status(400).json({ error: `API Error: ${responseDict.errorCode}` });
    }
  } catch (error) {
    console.error("Error during API call:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function addAuthParams(appKey, appSecret, params) {
  const q = params.q;
  const salt = uuid.v1();
  const curtime = Math.floor(Date.now() / 1000).toString();
  const sign = calculateSign(appKey, appSecret, q, salt, curtime);

  params.appKey = appKey;
  params.salt = salt;
  params.curtime = curtime;
  params.signType = "v3";
  params.sign = sign;
}

function calculateSign(appKey, appSecret, q, salt, curtime) {
  const input = getInput(q);
  const strSrc = appKey + input + salt + curtime + appSecret;
  return encrypt(strSrc);
}

function encrypt(strSrc) {
  const hash = crypto.createHash("sha256");
  hash.update(strSrc);
  return hash.digest("hex");
}

function getInput(input) {
  if (!input) return input;
  const inputLen = input.length;
  return inputLen <= 20
    ? input
    : input.substring(0, 10) + inputLen + input.substring(inputLen - 10);
}

function doCall(url, headers, params, method) {
  return new Promise((resolve, reject) => {
    const options = { method, headers };
    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", (e) => reject(e));
    const queryString = querystring.stringify(params);
    req.setHeader("Content-Length", Buffer.byteLength(queryString));
    req.write(queryString);
    req.end();
  });
}
