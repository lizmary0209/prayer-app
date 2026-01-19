const express = require("express");
const router = express.Router();
const Card = require("../models/Card");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const cards = await Card.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "displayName profilePic");

        res.json({ cards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, reference, message } = req.body;

        if (!title?.trim() || !reference?.trim()) {
            return res.status(400).json({ message: "Title and scripture reference are required" });
        }

        const newCard = await Card.create({
           title: title.trim(), 
            reference: reference.trim(),
            message: message ? message.trim() : "",
            isPremade: false,
            createdBy: req.user.id,
            likes: [],
        });

        res.status(201).json({ message: "Card created", card: newCard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: "Card not found" });

        if (!Array.isArray(card.likes)) {
            card.likes = [];
        }

        const userId = req.user.id;


        const alreadyLiked = card.likes.some((id) => id.toString() === userId);

        if (alreadyLiked) {
            card.likes = card.likes.filter((id) => id.toString() !== userId);
        } else {
            card.likes.push(userId);
        }

        await card.save();


        res.json({ message: "Like updated", card, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;