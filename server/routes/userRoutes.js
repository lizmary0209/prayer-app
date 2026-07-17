const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMe, updateMe, recordSalvation } = require("../controllers/users");
const Prayer = require("../models/Prayer");

router.get("/me", authMiddleware, getMe);

router.patch("/me", authMiddleware, updateMe); 

router.get("/me/prayers", authMiddleware, async (req, res) => {
  try {
    const prayers = await Prayer.find({ createdBy: req.user.id })
    .populate("createdBy", "displayName profilePic")
    .sort({ createdAt: -1 });

    res.json({ prayers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/me/salvation", authMiddleware, recordSalvation);


module.exports = router;