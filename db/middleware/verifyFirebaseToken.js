const { auth } = require("../../firebase-admin");

const verifyFirebaseToken = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    req.uid = "mockUserId";
    console.log("Test environment detected. Mock UID set.");
    return next();
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    console.log("Authorization token is missing");
    return res.status(401).send({ msg: "Authorization token is required" });
  }

  auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.uid = decodedToken.uid;

      next();
    })
    .catch((err) => {
      res.status(401).send({ msg: "Unauthorized" });
    });
};

module.exports = verifyFirebaseToken;
