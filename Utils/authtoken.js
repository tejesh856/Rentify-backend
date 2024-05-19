const jwt = require("jsonwebtoken");
const verifyauthtoken = (req, res, next) => {
  if (!req.cookies.authToken) {
    if (
      req.url === "/otpgenerate" ||
      req.url === `/otpmatching` ||
      req.url === `/newpassword`
    ) {
      return next();
    }
    return res.status(401).json({ success: false, message: "Access Denied." });
  }
  jwt.verify(
    req.cookies.authToken,
    process.env.ACCESS_SECRET,
    (err, payload) => {
      if (err) {
        return res.status(401).json({ success: false, message: err.name });
      }
      if (
        req.url === "/otpgenerate" ||
        req.url === `/otpmatching` ||
        req.url === `/newpassword`
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Logout first." });
      }
      req.payload = payload;
      return next();
    }
  );
};
const generateauthtoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = {
      _id: id,
    };

    jwt.sign(
      tokenid,
      process.env.ACCESS_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};
module.exports = {
  generateauthtoken,
  verifyauthtoken,
};
