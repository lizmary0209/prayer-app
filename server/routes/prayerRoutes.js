const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Prayer = require("../models/Prayer");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Hello ${req.user.displayName}, you have accessed a protected route!`,
  });
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, scripture } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newPrayer = await Prayer.create({
      title,
      description,
      scripture: scripture || "",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Prayer request created successfully",
      prayer: newPrayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const prayers = await Prayer.find()
      .populate("createdBy", "displayName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Prayers fetched successfully",
      prayers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/pray", authMiddleware, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ message: "Prayer not found" });

    prayer.prayedCount += 1;
    await prayer.save();

    res.status(200).json({
      message: "Prayer count updated",
      prayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ message: "Prayer not found" });

    prayer.comments.push({
      user: req.user.id,
      text,
    });
    await prayer.save();

    res.status(201).json({
      message: "Comment added",
      prayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
