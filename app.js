const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/", (req, res) => {
  res.send("OHHHH YEAHH it totally works");
});
