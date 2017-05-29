"use strict";
module.exports = class xkcd{
  constructor(number, imageURL){
    this.number = number;
    this.url = `https://xkcd.com/${number}/`;
    this.imageURL = `http://www.explainxkcd.com${imageURL}`
  }
};