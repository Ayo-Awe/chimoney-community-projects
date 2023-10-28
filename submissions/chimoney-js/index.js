const { AuthKeyError, TypeError } = require("./Errors");
const Account = require("./modules/Account");
const Info = require("./modules/Info");
const Payouts = require("./modules/Payouts");
const Wallet = require("./modules/Wallet");
const Redeem = require("./modules/Redeem");
const MobileMoney = require("./modules/MobileMoney");
const SubAccount = require("./modules/SubAccount");

/**
 * This function sets up the chimoneyjs modules using an optional key or options
 * @param {string|Object?} options Chimoney API Key or Options
 * @returns The chimoneyjs Modules
 */
module.exports = function (arg) {
  const { apiKey, sandbox } = parseArgs(arg);

  if (!apiKey && !process.env.CHIMONEY_API_KEY) {
    throw new AuthKeyError("Missing auth key");
  }

  const moduleOptions = {
    sandbox,
    apiKey: apiKey || process.env.CHIMONEY_API_KEY,
  };

  // Return modules
  return {
    account: new Account(moduleOptions),
    info: new Info(moduleOptions),
    payouts: new Payouts(moduleOptions),
    wallet: new Wallet(moduleOptions),
    subAccount: new SubAccount(moduleOptions),
    redeem: new Redeem(moduleOptions),
    mobileMoney: new MobileMoney(moduleOptions),
  };
};

function parseArgs(optionsOrAPIKey) {
  if (typeof optionsOrAPIKey === "string") {
    // args is an API Key
    return { apiKey: optionsOrAPIKey };
  } else if (typeof optionsOrAPIKey === "object") {
    // args represents options i.e { sandbox: Boolean, apiKey: String }
    const sandbox = optionsOrAPIKey.sandbox === true;
    const apiKey = optionsOrAPIKey.apiKey;

    if (apiKey && typeof apiKey !== "string") {
      throw new TypeError("apiKey must be a string");
    }

    return { apiKey, sandbox };
  }

  return {};
}
