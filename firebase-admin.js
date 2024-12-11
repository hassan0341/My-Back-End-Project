const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin.firestore();
