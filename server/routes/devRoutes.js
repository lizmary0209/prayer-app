const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

router.post("/seed-cards", async (req, res) => {
    try {
        const premade = [
            {
                title: "Strength",
                scripture: "Isaiah 41:10",
                message: "You're not alone-God is with you.",
                isPremade: true,
            },
            {
                title: "Peace",
                scripture: "Philippians 4:6-7",
                message: "Bring it to God-His peace will guard your heart.",
                isPremade: true,
            },
            {
                title: "Hope",
                scripture: "Romans 15:13",
                message: "May you overflow with hope by the power of the Holy Spirit.",
                isPremade: true,
            },
        ];

        const ops = premade.map((c) => ({
            updateOne: {
                filter: { scripture: c.scripture, isPremade: true },
                update: { $setOnInsert: c },
                upsert: true,
            },
        }));

        const result = await Card.bulkWrite(ops);
        res.json({ message: "Seed complete", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;