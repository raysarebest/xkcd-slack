"use strict";
let Botkit = require("botkit");
let http = require("http");
let API = require("./api.js");

if(!process.env.XKCD_CLIENT_ID || !process.env.XKCD_CLIENT_SECRET || !process.env.PORT || !process.env.XKCD_VERIFICATION_TOKEN){
    console.log('Error: Specify XKCD_CLIENT_ID, XKCD_CLIENT_SECRET and XKCD_VERIFICATION_TOKEN in environment');
    process.exit(1);
}

let config = {};
if(process.env.MONGOLAB_URI){
  let BotkitStorage = require('botkit-storage-mongo');
  config = {storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI})};
}
else{
  config = {json_file_store: './db_slackbutton_slash_command/'};
}

let controller = Botkit.slackbot(config).configureSlackApp({clientId: process.env.XKCD_CLIENT_ID, clientSecret: process.env.XKCD_CLIENT_SECRET, scopes: ['commands']});

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, (error, req, res) => {
    if(error){
      res.status(500).send('ERROR: ' + error);
    }
    else{
      res.send('Success!');
    }
  });
});

controller.on('slash_command', (slashCommand, message) => {
  switch(message.command){
    case "/xkcd":
      if (message.token !== process.env.XKCD_VERIFICATION_TOKEN){
        return;
      }
      else{
        if (message.text === "" || message.text === "help") {
          slashCommand.replyPrivate(message, "I'll find you an xkcd comic for whatever situation you wanna give me");
          return;
        }
        slashCommand.replyPublic(message, "", () => {
          API.get(message.text, (result, error) => {
            if(error){
              slashCommand.replyPublicDelayed(message, "Sorry, but something went wrong :cry:");
            }
            else{
              slashCommand.replyPublicDelayed(message, {attachments: [{fallback: `xkcd comic ${result.number}`, title: result.number, title_link: result.url, text: result.caption, image_url: result.imageURL}]});
            }
          });
        });
      }
      break;
    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + "yet.");
  }
});