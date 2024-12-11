/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "janenoh12@gmail.com",
    pass: "oqbr zbwa ucjz kjml",
  },
});

// eslint-disable-next-line max-len
exports.sendVaccineReminders = functions.pubsub.schedule("every day 00:00").onRun(async () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const today = `Expired. Due ${currentDate}`;

  console.log(today);

  try {
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      console.log("No users found.");
      return null;
    }

    const emailPromises = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const userEmail = userData.email;
      const reminders = [];

      // Check each dog's vaccines
      userData.dogs.forEach((dog) => {
        if (dog.subscribed) {
          dog.vaccines.forEach((vaccine) => {
            if (vaccine.reminder === today) {
              reminders.push({
                dogName: dog.name,
                vaccineType: vaccine.type,
              });
            }
          });
        }
      });

      if (reminders.length > 0) {
        const reminderText = reminders
            .map((r) => `${r.dogName}: ${r.vaccineType}`)
            .join("\n");

        const mailOptions = {
          from: "no-reply@pawsup.com",
          to: userEmail,
          subject: "Dog Vaccine Reminder",
          text: `Hello, here are the vaccines due today:\n\n${reminderText}`,
        };

        emailPromises.push(transporter.sendMail(mailOptions));
      }
    });

    await Promise.all(emailPromises);
    console.log("Reminder emails sent successfully.");
    return null;
  } catch (error) {
    console.error("Error sending reminders:", error);
    throw error;
  }
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
