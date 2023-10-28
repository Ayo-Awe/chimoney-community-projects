const { ValueError, TypeError } = require("../Errors");
const { HTTPMETHODS, formatJoiErrors } = require("../utils/helpers");
const Joi = require("joi");
const Base = require("./Base");

class Wallet extends Base {
  /**
   * This function gets all the wallets associated with a user
   * @param {string?} subAccount The subAccount of the transaction
   * @returns The response from the Chi Money API
   */
  async list(subAccount = null) {
    const payload = {};

    if (subAccount) payload.subAccount = subAccount;

    return this.client.handleRequest({
      method: HTTPMETHODS.POST,
      path: "/wallets/list",
      payload,
    });
  }

  /**
   * This function gets the details associated with a single user wallet
   * @param {string} id The wallet id
   * @param {string?} subAccount The subAccount of the transaction
   * @returns The response from the Chi Money API
   */
  async details(id, subAccount = null) {
    if (!id) throw new ValueError("id is required");

    if (typeof id !== "string")
      throw new TypeError("id must be of type string");

    const payload = {};

    if (subAccount) payload.subAccount = subAccount;

    return this.client.handleRequest({
      method: HTTPMETHODS.POST,
      payload,
      path: "/wallets/lookup",
    });
  }

  /**
   * This function lets you transfer funds to receiver
   * @param {string} receiver The receiver id
   * @param {string} wallet The wallet type
   * @param {number} amount The amount of funds to be transferred in dollars
   * @param {string?} subAccount The subAccount of the transaction
   * @returns The response from the Chi Money API
   */
  async transfer(receiver, wallet, amount, subAccount) {
    // Define validation schema
    const schema = Joi.object({
      receiver: Joi.string().required(),
      wallet: Joi.string().required(),
      amount: Joi.number().required(),
    });

    // Validate input
    const { value, error } = schema.validate(
      {
        receiver,
        wallet,
        amount,
      },
      { abortEarly: false }
    );

    if (error) throw new ValueError("invalid input(s)", formatJoiErrors(error));

    const payload = { ...value };

    if (subAccount) payload.subAccount = subAccount;

    return this.client.handleRequest({
      method: HTTPMETHODS.POST,
      payload,
      path: "/wallets/transfer",
    });
  }
}

module.exports = Wallet;
