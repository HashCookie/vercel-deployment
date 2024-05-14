const express = require("express");
const cors = require("cors");
const { addAuthParams } = require("./auth");
const { doCall } = require("./request");
const { APP_KEY, APP_SECRET, API_URL, PORT } = require("./config");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // 更改为你的 React 应用程序的 URL
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/score", async (req, res) => {
  const { essay } = req.body;
  const data = { q: essay, grade: "cet4" };
  addAuthParams(APP_KEY, APP_SECRET, data);
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const responseText = await doCall(API_URL, headers, data, "POST");
    const responseDict = JSON.parse(responseText);

    if (responseDict.errorCode && responseDict.errorCode !== "0") {
      console.error("API Error:", responseDict.errorCode, responseDict.msg);
      return res
        .status(400)
        .json({ error: `API Error: ${responseDict.errorCode}` });
    }

    console.log("Parsed Response:", responseDict);
    const totalScore = responseDict.Result.totalScore;
    res.json({ totalScore });
  } catch (error) {
    console.error("Error during API call:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
