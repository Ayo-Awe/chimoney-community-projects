const ChimoneyClient = require("../client");

class Base {
  constructor({ sandbox, apiKey }) {
    this.client = new ChimoneyClient({ sandbox, apiKey });
  }
}

module.exports = Base;
