"use strict";
let Botkit = require("botkit");
let http = require("http");

if(!process.env.XKCD_CLIENT_ID || !process.env.XKCD_CLIENT_SECRET || !process.env.XKCD_PORT || !process.env.XKCD_VERIFICATION_TOKEN){
    console.log('Error: Specify XKCD_CLIENT_ID, XKCD_CLIENT_SECRET, XKCD_VERIFICATION_TOKEN and XKCD_PORT in environment');
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

controller.setupWebserver(process.env.XKCD_PORT, (error, webserver) => {
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
        slashCommand.replyPublicDelayed(message, "", () => {
          //TODO: Implement the actual functionality
        });
      }
      break;
    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + "yet.");
  }
});