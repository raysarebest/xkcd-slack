"use strict";
const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
const xkcd = require("./xkcd.js");

module.exports.get = (query, callback) => {
  http.get(`http://relevantxkcd.appspot.com/process?action=xkcd&query=${encodeURI(query)}`, (APIResponse) => {
    let APIResponseString = "";
    APIResponse.on("data", (data) => {
      APIResponseString += data;
    });
    APIResponse.on("end", () => {
      const result = APIResponseString.trim().split(" \n")[2].split(" ");
      let response = new xkcd(result[0], result[1]);
      https.get(response.url, (xkcdResponse) => {
        let xkcdString = "";
        xkcdResponse.on("data", (data) => {
          xkcdString += data;
        });
        xkcdResponse.on("end", () => {
          const xkcdDOM = cheerio.load(xkcdString);
          response.caption = xkcdDOM("#comic > img")[0].attribs.title;
          response.title = xkcdDOM("#ctitle").text();
          callback(response, null);
        });
        xkcdResponse.on("error", (error) => {
          callback(null, error);
        })
      });
    });
    APIResponse.on("error", (error) => {
      callback(null, error);
    })
  });
};