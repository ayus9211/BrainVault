const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are BrainVault AI Assistant for an online learning platform. Help students with course recommendations and learning tips. Keep answers short and friendly. Question: ${message}`,
              },
            ],
          },
        ],
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry I could not get a response!";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.log("Chatbot Error:",error.response?.data || error.message);
    res.status(500).json({ success: false, reply: "Something went wrong!" });
  }
});

module.exports = router;