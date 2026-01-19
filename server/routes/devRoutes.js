const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

router.post("/fix-card-references", async (req, res) => {
  try {
    const cards = await Card.find({}, { _id: 1, reference: 1 });

    let fixed = 0;

    for (const card of cards) {
      if (card.reference === "$scripture") {
        await Card.updateOne(
          { _id: card._id },
          { $set: { reference: "Isaiah 41:10" } }
        );
        fixed++;
      }
    }

    res.json({ message: "Card references cleaned", fixed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/seed-cards", async (req, res) => {
  try {
    const premade = [
      {
        title: "Strength",
        reference: "Isaiah 41:10",
        message: "You're not alone—God is with you.",
        isPremade: true,
      },
      {
        title: "Peace",
        reference: "Philippians 4:6-7",
        message: "Bring it to God—His peace will guard your heart.",
        isPremade: true,
      },
      {
        title: "Hope",
        reference: "Romans 15:13",
        message: "May you overflow with hope by the power of the Holy Spirit.",
        isPremade: true,
      },
    ];

    const ops = premade.map((c) => ({
      updateOne: {
        filter: { reference: c.reference, isPremade: true },
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


