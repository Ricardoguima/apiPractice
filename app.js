const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DevOps Demo</title>
        <style>
          body {
            background-color: #111;
            color: #ffffff;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-size: 2rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        OHHHHH YEAHHHH
        <br><br>
        ...it totally works 
      </body>
    </html>
  `);
});
