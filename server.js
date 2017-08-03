const express = require("express");

const app = express();

app.post("login", (req, res) => {
    res.send("woah");
});

app.use(express.static("client/dist"));
app.listen(process.env.PORT || 80);