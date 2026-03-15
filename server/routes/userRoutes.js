const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Prayer = require("../models/Prayer");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { displayName, profilePic } = req.body;

    const updates = {};
    if (typeof displayName === "string" && displayName.trim()) {
      updates.displayName = displayName.trim();
    }
    if (typeof profilePic === "string") {
      updates.profilePic = profilePic.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ message: "Profile Updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me/prayers", authMiddleware, async (req, res) => {
  try {
    const prayers = await Prayer.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ prayers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/me/salvation", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.salvationDate) {
      user.salvationDate = new Date();
      await user.save();
    }

    res.status(200).json({
      message: "Welcome to the family of God. Your salvation has been recorded.",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;