"use strict";
let Botkit = require("botkit");
let http = require("http");
let API = require("./api.js");

if(!process.env.PORT || !process.env.SLACK_VERIFY_TOKEN){
    console.log('Error: Specify PORT and SLACK_VERIFY_TOKEN in environment');
    process.exit(1);
}

let controller = Botkit.slackbot();
require('beepboop-botkit').start(controller, {debug: true});

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  if(error){
    console.error(error);
    process.exit(1);
  }
  controller.createWebhookEndpoints(controller.webserver);
});

controller.on('slash_command', (slashCommand, message) => {
  switch(message.command){
    case "/xkcd":
      if (message.token !== process.env.SLACK_VERIFY_TOKEN){
        return;
      }
      else{
        if (message.text === "" || message.text.toLowerCase() === "help") {
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