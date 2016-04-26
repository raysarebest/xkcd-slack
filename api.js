"use strict";
let http = require("http");
let cheerio = require("cheerio");
let XKCD = require("./xkcd.js");

module.exports.get = (query, callback) => {
  http.get(`http://relevantxkcd.appspot.com/process?action=xkcd&query=${encodeURI(query)}`, (APIResponse) => {
    let APIResponseString = "";
    APIResponse.on("data", (data) => {
      APIResponseString += data;
    });
    APIResponse.on("end", () => {
      let result = APIResponseString.trim().split(" \n")[2].split(" ");
      let xkcd = XKCD(result[0], result[1]);
      http.get(xkcd.url, (xkcdResponse) => {
        let xkcdString = "";
        xkcdResponse.on("data", (data) => {
          xkcdString += data;
        });
        xkcdResponse.on("end", () => {
          let xkcdDOM = cheerio.load(xkcdString);
          xkcd.caption = xkcdDOM("#comic > img")[0].attribs.title;
          callback(xkcd, null);
        });
        xkcdResponse.on("error", (error) => {
          callback(null, error);
        })
      });
      callback(xkcd, null);
    });
    APIResponse.on("error", (error) => {
      callback(null, error);
    })
  });
};