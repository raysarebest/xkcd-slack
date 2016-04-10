class XKCD {
  constructor(url, imageURL) {
    this.url = `http://xkcd.com/${url}`;
    this.imageURL = `http://www.explainxkcd.com${imageURL}`
  }
}

module.exports = XKCD;