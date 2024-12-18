const { auth } = require("../../firebase-admin");

const verifyFirebaseToken = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    req.uid = "mockUserId";

    return next();
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).send({ msg: "Authorization token is required" });
  }

  auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.uid = decodedToken.uid;
      next();
    })
    .catch(() => {
      res.status(401).send({ msg: "Unauthorized" });
    });
};

module.exports = verifyFirebaseToken;
