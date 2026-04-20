const express = require('express');
const router = express.Router();

// Knowledge base for the AI bot
const KNOWLEDGE_BASE = {
    composting: "Organic composting requires a balance of 'greens' (nitrogen) and 'browns' (carbon). Aim for a 1:3 ratio. Keep it moist but not soaked!",
    pests: "To control pests naturally, try neem oil or introducing beneficial insects like ladybugs. Marigolds planted nearby also act as a natural repellent.",
    soil: "Test your soil pH regularly. For organic farming, healthy soil is rich in organic matter. Use cover crops like clover to fix nitrogen.",
    organic: "Organic farming avoids synthetic pesticides and fertilizers. Focus on crop rotation and natural biodiversity to keep your farm healthy.",
    default: "I'm your Organic Farming expert. You can ask me about composting, natural pest control, soil health, or organic certification!"
};

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const msg = message.toLowerCase();
        let response = KNOWLEDGE_BASE.default;

        if (msg.includes('compost')) response = KNOWLEDGE_BASE.composting;
        else if (msg.includes('pest') || msg.includes('bug')) response = KNOWLEDGE_BASE.pests;
        else if (msg.includes('soil') || msg.includes('dirt')) response = KNOWLEDGE_BASE.soil;
        else if (msg.includes('organic') || msg.includes('rule')) response = KNOWLEDGE_BASE.organic;

        // Simulate AI thinking time
        setTimeout(() => {
            res.json({ reply: response });
        }, 500);
    } catch (error) {
        res.status(500).json({ message: "AI Assistant is resting right now." });
    }
});

module.exports = router;
