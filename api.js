var http = require("http");

function getData(query, callback){
  http.get(`http://relevantxkcd.appspot.com/process?action=xkcd&query=${encodeURI(query)}`, (response) => {
    let responseString = "";
    response.on("data", (data) => {
      responseString += data;
    });
    response.on("end", () => {
      callback(`http://www.explainxkcd.com${responseString.trim().split(" \n")[2].split(" ")[1]}`, null);
    });
    response.on("error", (error) => {
      callback(null, error);
    })
  });
}

(response) => {
  let responseString = "";
  response.on("data", (data) => {
    responseString += data;
  });
  response.on("end", () => {
    console.log(responseString);
  });
  response.on("error", () => {
    slashCommand.replyPublicDelayed(message, "Something went wrong...");
  });
}