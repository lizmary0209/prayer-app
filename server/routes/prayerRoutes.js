const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Prayer = require("../models/Prayer");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message:"Protected route ok", user:req.user });
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, scripture, category } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newPrayer = await Prayer.create({
      title,
      description,
      scripture: scripture || "",
      category: category || "neutral",
      createdBy: req.user.id,
    });

    await newPrayer.populate("createdBy", "displayName profilePic");

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

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, scripture, category } = req.body;
    const prayer = await Prayer.findById(req.params.id);

    if (!prayer) {
      return res.status(404).json({ message: "Prayer not found" });
    }

    if (prayer.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only edit your own prayers." });
    }

    if (title !== undefined) prayer.title = title;
    if (description !== undefined) prayer.description = description;
    if (scripture !== undefined) prayer.scripture = scripture;
    if (category !== undefined) prayer.category = category;

    await prayer.save();
    await prayer.populate("createdBy", "displayName profilePic");

    res.status(200).json({
      message: "Prayer updated successfully",
      prayer,
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

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ message: "Prayer not found" });

    if (!Array.isArray(prayer.likes)) {
      prayer.likes = [];
    }

    const userId = req.user.id;
    const alreadyLiked = prayer.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      prayer.likes = prayer.likes.filter((id) => id.toString() !== userId);
    } else {
      prayer.likes.push(userId);
    }

    await prayer.save();

    res.json({ message: "Like updated", prayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
