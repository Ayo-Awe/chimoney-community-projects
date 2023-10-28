require("dotenv").config();
const { TypeError, ChiMoneyError } = require("./Errors");
const axios = require("axios");
const Joi = require("joi");

const BASE_URL = "https://api.chimoney.io/v0.2";
const SANDBOX_URL = "https://api-v2-sandbox.chimoney.io/v0.2";

const HTTPMETHODS = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
};

class ChimoneyClient {
  /**
   * Initialize a chimoney API client
   * @param {{sandbox?: Boolean, apiKey: String}} options Client options
   */
  constructor({ sandbox, apiKey }) {
    this.axios = axios.create({
      baseURL: sandbox ? SANDBOX_URL : BASE_URL,
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    });
  }

  async handleRequest(requestOptions) {
    try {
      // Define validation schema for requestOptions
      const schema = Joi.object({
        method: Joi.valid(...Object.values(HTTPMETHODS)).default(
          HTTPMETHODS.GET
        ),
        path: Joi.string().default(""),
        payload: Joi.object().default({}),
        params: Joi.object().default({}),
      });

      // Validate request options using validation schema
      const { value, error } = schema.validate(requestOptions);

      // Throw error if requestOptions fails validator checks
      if (error) {
        throw new TypeError("Invalid type provided", formatJoiErrors(error));
      }

      const { method, path, payload, params } = value;

      // Make request
      const response = await this.axios({
        method,
        url: path,
        data: payload,
        params,
      });

      return response.data;
    } catch (error) {
      // Catch Chimoney API errors
      if (error.response?.data.status?.toLowerCase() === "error") {
        throw new ChiMoneyError(error.response.data.error);
      }
      // Throw other errors
      throw error;
    }
  }
}

module.exports = ChimoneyClient;
