const Joi = require("joi");
const { ValueError, TypeError } = require("../Errors");
const { HTTPMETHODS, formatJoiErrors } = require("../utils/helpers");
const Base = require("./Base");

class Info extends Base {
  /**
   * This  returns a list of countries that support airtime
   * @returns The response from Chi Money API
   */
  async airtimeCountries() {
    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      path: "/info/airtime-countries",
    });
  }

  /**
   * This  returns a list of supported assets
   * @returns The response from the Chi Money API
   */
  async assets() {
    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      path: "/info/assets",
    });
  }

  /**
   *
   * @param {string} country The country code, default is Nigeria(NG).
   * @returns The response from Chi Money API
   */
  async banks(country = "NG") {
    // country is required
    if (!country) throw new ValueError("country is required");

    // country must be a string
    if (typeof country !== "string")
      throw new TypeError("country must be of type string");

    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      params: { countryCode: country },
      path: "/info/country-banks",
    });
  }

  /**
   * This  returns the equivalent of local currency in USD
   * @param {string} originCurrency The source currency
   * @param {number} amountInOriginCurrency The amount in the origin currency
   * @returns The response from the Chi Money API
   */
  async localAmountInUSD(originCurrency, amountInOriginCurrency) {
    // Define validation schema
    const schema = Joi.object({
      originCurrency: Joi.string().required(),
      amountInOriginCurrency: Joi.number().required(),
    });

    // Validate input
    const { value, error } = schema.validate(
      {
        originCurrency,
        amountInOriginCurrency,
      },
      { abortEarly: false }
    );

    // Handle validation errors
    if (error) throw new ValueError("Invalid input(s)", formatJoiErrors(error));

    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      params: { ...value },
      path: "/info/local-amount-in-usd",
    });
  }

  /**
   * This  returns a list of supported mobile money codes
   * @returns The response from the Chi Money API
   */
  async mobileMoneyCodes() {
    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      path: "/info/mobile-money-codes",
    });
  }

  /**
   * This  returns the equivalent of USD in the destination currency.
   * @param {string} destinationCurrency The destination currency
   * @param {number} amountInUSD The amount in USD
   * @returns The response from the Chi Money API
   */
  async usdInLocalAmount(destinationCurrency, amountInUSD) {
    // Define validation schema
    const schema = Joi.object({
      destinationCurrency: Joi.string().required(),
      amountInUSD: Joi.number().required(),
    });

    // Validate input
    const { value, error } = schema.validate(
      {
        destinationCurrency,
        amountInUSD,
      },
      { abortEarly: false }
    );

    // Handle validation errors
    if (error) throw new ValueError("Invalid input(s)", formatJoiErrors(error));

    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      params: { ...value },
      path: "/info/usd-amount-in-local",
    });
  }
}
module.exports = Info;
