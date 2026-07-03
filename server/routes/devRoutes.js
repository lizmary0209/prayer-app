const express = require("express");
const router = express.Router();
const Prayer = require("../models/Prayer");

router.post("/fix-prayer-scripture", async (req, res) => {
  try {
    const prayers = await Prayer.find(
      { scripture: "$scripture" },
      { _id: 1, scripture: 1 }
    );

    let fixed = 0;

    for (const prayer of prayers) {
      if (prayer.scripture === "$scripture") {
        await Prayer.updateOne(
          { _id: prayer._id },
          { $set: { scripture: "Isaiah 41:10" } }
        );
        fixed++;
      }
    }

    res.json({ message: "Prayer scripture cleaned", fixed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/seed-prayers", async (req, res) => {
  try {
    const premade = [
      {
        title: "Strength",
        scripture: "Isaiah 41:10",
        message: "You're not alone - God is with you.",
        isPremade: true,
      },
      {
        title: "Peace",
        scripture: "Philippians 4:6-7",
        message: "Bring it to God - His peace will guard your heart.",
        isPremade: true,
      },
      {
        title: "Hope",
        scripture: "Romans 15:13",
        message: "May you overflow with hope by the power of the Holy Spirit.",
        isPremade: true,
      },
    ];

    const ops = premade.map((p) => ({
      updateOne: {
        filter: { scripture: p.scripture, isPremade: true },
        update: { $setOnInsert: p },
        upsert: true,
      },
    }));

    const result = await Prayer.bulkWrite(ops);

    res.json({ message: "Seed complete", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

