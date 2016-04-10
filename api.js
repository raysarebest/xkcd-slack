"use strict";
let http = require("http");
let XKCD = require("./xkcd.js");

module.exports.get = (query, callback) => {
  http.get(`http://relevantxkcd.appspot.com/process?action=xkcd&query=${encodeURI(query)}`, (response) => {
    let responseString = "";
    response.on("data", (data) => {
      responseString += data;
    });
    response.on("end", () => {
      let result = responseString.trim().split(" \n")[2].split(" ");
      callback(new XKCD(result[0], result[1]), null);
    });
    response.on("error", (error) => {
      callback(null, error);
    })
  });
};