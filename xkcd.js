"use strict";
module.exports = class XKCD{
  constructor(number, imageURL){
    this.number = number;
    this.url = `http://xkcd.com/${number}`;
    this.imageURL = `http://www.explainxkcd.com${imageURL}`
  }
};