// To install: npm i @tavily/core
require("dotenv").config();
const { tavily } = require("@tavily/core");
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

module.exports = tavilyClient;
