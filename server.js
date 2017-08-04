'use strict';
const axios = require("axios");
const rsa = require("./rsa");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');
const serveStatic = require("serve-static");
const port = process.env.PORT || 80;
axiosCookieJarSupport(axios);

const app = express();
app.use(cookieParser()); 
app.use(bodyParser.json());

const getCredentials = async function (req) {
    const cookieJar = new tough.CookieJar();
    const key = new rsa.RSAKey();
    if (req.headers.cookie != undefined) {
        cookieJar.setCookieSync(req.headers.cookie, "https://is.sps-prosek.cz");
    }
    let r = await axios.get("https://is.sps-prosek.cz/6NpSdyj2TJw45LYb.php", {
        jar: cookieJar,
        withCredentials: true
    });

    key.setPublic(r.data.n, r.data.e);
    return { cookieJar: cookieJar, key: key };
}

const status = async function (req, res) {
    const { cookieJar, key } = await getCredentials(req);
    const func = rsa.linebrk(key.encrypt("status"), 64); 
    let r = await axios.post(`https://is.sps-prosek.cz/login.php?function=${func}`, undefined, {
        jar: cookieJar,
        withCredentials: true
    });
    res.setHeader("Set-Cookie", cookieJar.getSetCookieStringsSync("https://is.sps-prosek.cz"));
    res.send({ logged: r.data.STATUS });
};

const login = async function (req, res) {
    const { cookieJar, key } = await getCredentials(req);
    const func = rsa.linebrk(key.encrypt("userlogin"), 64);
    const r = await axios.post(`https://is.sps-prosek.cz/login.php?function=${func}`, "data=" + JSON.stringify(
        {
            password: rsa.linebrk(key.encrypt(req.body.password), 64),
            username: req.body.username
        }),
        {
            jar: cookieJar,
            withCredentials: true
        });
    res.setHeader("Set-Cookie", cookieJar.getSetCookieStringsSync("https://is.sps-prosek.cz"));
    res.send({ success: r.data.STATUS });
}

const grades = async function (req, res) {
    const { cookieJar, key } = await getCredentials(req);
    const func = rsa.linebrk(key.encrypt("myclassification"), 64);
    const r = await axios.post(`https://is.sps-prosek.cz/classification.php?function=${func}`, "data=" + JSON.stringify(
        {
            type: "student"
        }), {
            jar: cookieJar,
            withCredentials: true
        });
    res.setHeader("Set-Cookie", cookieJar.getSetCookieStringsSync("https://is.sps-prosek.cz"));
    res.send(r.data);
}

app.get("/status", status);
app.post("/login$", login);
app.get("/grades", grades);
app.use("/", serveStatic(__dirname + "/client/dist", { maxAge: "1d" }));

app.listen(port);
