const Joi = require("joi");
const { ValueError, TypeError } = require("../Errors");
const { formatJoiErrors, HTTPMETHODS } = require("../utils/helpers");
const Base = require("./Base");

class SubAccount extends Base {
  /**
   * This function creates a new subAccount with the provided name and email
   * @param {string} name Name to give the new subAccount
   * @param {string} email Email
   * @returns The response from the Chi Money API
   */
  async create(name, email) {
    // Define validation schema
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
    });

    // Validate input
    const { value, error } = schema.validate(
      { name, email },
      { abortEarly: false }
    );

    if (error) throw new ValueError("invalid input(s)", formatJoiErrors(error));

    const payload = { ...value };

    return this.client.handleRequest({
      method: HTTPMETHODS.POST,
      payload,
      path: "/sub-account/create",
    });
  }

  /**
   * This function deletes the subAccount with the given id
   * @param {string} id The id of the subAccount
   * @returns The response from the Chi Money API
   */
  async deleteAccount(id) {
    if (!id) throw new ValueError("id is required");

    if (typeof id !== "string")
      throw new TypeError("id must be of type string");

    const params = { id };

    return this.client.handleRequest({
      method: HTTPMETHODS.DELETE,
      params,
      path: "/sub-account/delete",
    });
  }

  /**
   * This function gets the details of the subAccount with the associated id
   * @param {string} id The id of the subAccount
   * @returns The response from the Chi Money API
   */
  async getDetails(id) {
    if (!id) throw new ValueError("id is required");

    if (typeof id !== "string")
      throw new TypeError("id must be of type string");

    const params = { id };

    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      params,
      path: "/sub-account/get",
    });
  }

  /**
   * This function returns all the subAccounts associated with a user
   * @returns The response from the Chi Money API
   */
  async getAll() {
    return this.client.handleRequest({
      method: HTTPMETHODS.GET,
      path: "/sub-account/list",
    });
  }
}

module.exports = SubAccount;
