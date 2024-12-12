const admin = require("firebase-admin");
let serviceAccount;

if (process.env.NODE_ENV === "production") {
  serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
} else {
  serviceAccount = require(process.env.FIREBASE_PRIVATE_KEY_PATH);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { firestore, auth };
