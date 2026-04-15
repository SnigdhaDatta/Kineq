const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { createAccessToken } = require("../services/authentication");
const crypto = require("crypto");
require("dotenv").config();

function validateAccessToken(token) {
  // Verify the token, if token matches the secret key and is not expired, it will return the decoded payload, otherwise it will throw an error
  const decoded = jwt.verify(token, process.env.jwt_secret_key);
  return decoded; // Return the decoded payload for use in subsequent middleware/route handlers
}

async function createAccessTokenViaRefreshToken(refreshToken) {
  try {
    if (!refreshToken) return null;
    const hashedRefreshToken = crypto
      .createHmac("sha256", process.env.refresh_token_pepper)
      .update(refreshToken)
      .digest("hex");
    const user = await User.findOne({ refreshToken: hashedRefreshToken });
    if (!user) return null;
    return createAccessToken(user);
  } catch (error) {
    return null; // Return null if the refresh token is invalid or an error occurs
  }
}

async function checkAuthentication(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token = null;
  if (authHeader) {
    token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  }

  //means token is not present in the request header, so we will try to create a new access token using the refresh token from cookies
  if (!token) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "REFRESH_EXPIRED" });
    }
    const newAccessToken = await createAccessTokenViaRefreshToken(refreshToken);
    if (!newAccessToken) {
      return res.status(401).json({ error: "REFRESH_EXPIRED" });
    }
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    token = newAccessToken;
  }

  try {
    // checking validation of jwt
    const decoded = validateAccessToken(token);
    req.user = decoded; // Attach the decoded payload to the request object for use in subsequent middleware/route handlers
    return next(); // Call the next middleware or route handler
  } catch (error) {
    // If access token is expired/invalid, attempt issuing a new one from refresh token.
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "REFRESH_EXPIRED" });
    }

    const newAccessToken = await createAccessTokenViaRefreshToken(refreshToken);
    if (!newAccessToken) {
      return res.status(401).json({ error: "REFRESH_EXPIRED" });
    }

    try {
      const decoded = validateAccessToken(newAccessToken);
      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      req.user = decoded;
      return next();
    } catch (refreshError) {
      return res.status(401).json({ error: "ACCESS_EXPIRED" });
    }
  }
}

module.exports = {
  validateAccessToken,
  checkAuthentication,
};
