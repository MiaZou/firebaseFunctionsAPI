/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// create account
app.post("/users/:uid/:hemisphere", async (req, res) => {
  try {
    await admin.firestore().collection("users").doc(req.params.uid).create({
      uid: req.params.uid,
      hemisphere: parseInt(req.params.hemisphere),
    });
    res.status(200).send("Account created successfully!");
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
  return;
});

// get user info
app.get("/weather/:id", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("users")
        .doc(req.params.id).get();
    const userData = snapshot.data();
    res.status(200).send(JSON.stringify({...userData}));
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
  return;
});

// add weather data input
app.put("/weatherdata/:id", async (req, res) => {
  const body = req.body;
  try {
    const snapshot = await admin.firestore().collection("users")
        .doc(req.params.id).get();
    const weatherData = snapshot.data().weatherData;
    const newWeatherData = [
      ...weatherData,
      {
        date: body.date,
        specialPattern: body.specialPattern,
        weatherTypes: body.weatherTypes,
      },
    ];
    await admin.firestore().collection("users").doc(req.params.id).update({
      weatherData: newWeatherData,
    });
    res.status(200).send("Weather data entered successfully.");
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
  return;
});

// add weather seed data
app.put("/weatherseed/:id/:weatherseed", async (req, res) => {
  try {
    await admin.firestore().collection("users").doc(req.params.id).update({
      weatherSeed: req.params.weatherseed,
    });
    res.status(200).send("Weather seed has been added.");
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
  return;
});

exports.user = functions.https.onRequest(app);
