const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: true, message: "All fields are required." });
  }

  try {
    await Contact.create({ name, email, message });
    res.status(200).json({ error: false, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: true, message: "Server error. Try again later." });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ error: false, data: messages });
  } catch (err) {
    res.status(500).json({ error: true, message: "Could not fetch contact messages." });
  }
});

module.exports = router;
