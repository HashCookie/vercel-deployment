const express = require("express");

const app = express();

app.use("/", (request, response) => {
  response.send("Hello World!");
});

app.listen(5010, () => console.log("Listening on port 3000"));
