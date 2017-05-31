"use strict";
const Botkit = require("botkit");
const http = require("http");
const API = require("./api.js");

if(!process.env.PORT || !process.env.SLACK_VERIFY_TOKEN || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET){
    console.error("Error: Specify PORT, SLACK_VERIFY_TOKEN, process.env.CLIENT_ID, and process.env.CLIENT_SECRET in the environment");
    process.exit(1);
}

const controller = Botkit.slackbot({json_file_store: "PRODUCTION-DATA-DO-NOT-TOUCH"}).configureSlackApp({clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, scopes: ["commands"]});

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  if(error){
    console.error(error);
    process.exit(1);
  }
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, (error, request, response) => {
        if(error){
            response.status(500).send('ERROR: ' + err);
        }
        else{
            response.send('Success! You can close this tab now.');
        }
    });
});

controller.on("slash_command", (slashCommand, message) => {
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
              slashCommand.replyPublicDelayed(message, {attachments: [{fallback: `xkcd comic ${result.number}: "${result.title}"`, title: result.title, title_link: result.url, text: result.caption, image_url: result.imageURL}]});
            }
          });
        });
      }
      break;
    default:
      slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + "yet.");
  }
});