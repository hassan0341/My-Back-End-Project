const { auth } = require("../../firebase-admin");

console.log("Firebase Auth Object:", auth);

const verifyFirebaseToken = (req, res, next) => {
  console.log("verifyFirebaseToken middleware invoked"); // Log to confirm middleware execution

  if (process.env.NODE_ENV === "test") {
    req.uid = "mockUserId";
    console.log("Test environment detected. Mock UID set.");
    return next();
  }

  const token = req.headers.authorization?.split("Bearer ")[1];
  console.log("Extracted Token:", token); // Log token for debugging

  if (!token) {
    console.log("Authorization token is missing");
    return res.status(401).send({ msg: "Authorization token is required" });
  }

  auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.log("Decoded Token:", decodedToken); // Log full decoded token
      req.uid = decodedToken.uid;
      console.log("Decoded Token UID:", decodedToken.uid); // Log UID
      next();
    })
    .catch((err) => {
      console.log("Error verifying token:", err); // Log error details
      res.status(401).send({ msg: "Unauthorized" });
    });
};

module.exports = verifyFirebaseToken;
