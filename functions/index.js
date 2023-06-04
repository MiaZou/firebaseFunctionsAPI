/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// update hemisphere info
app.put("/:id/hemisphere", async (req, res) => {
    try {
        await admin.firestore().collection("users").doc(req.params.id).update({
            hemisphere: req.params.hemisphere
        });

        res.status(200).send("Success");
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
    return;
});

// get user info
app.get("/:id", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();
        
        const userData = snapshot.data();
        res.status(200).send(JSON.stringify({...userData}));
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
    return;
});

exports.user = functions.https.onRequest(app);

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  });