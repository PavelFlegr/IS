var fs = require("fs");

navigator = {};
window = {};

eval(fs.readFileSync(__dirname+"/jsbn.js", "utf-8"));
eval(fs.readFileSync(__dirname +"/prng4.js", "utf-8"));
eval(fs.readFileSync(__dirname +"/rng.js", "utf-8"));
eval(fs.readFileSync(__dirname + "/rsa.js", "utf-8"));

exports.RSAKey = RSAKey;
exports.linebrk = linebrk;