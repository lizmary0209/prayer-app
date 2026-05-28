const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/count", async (req, res) => {
    try {
        const count = await User.countDocuments({
            countedInSalvationCounter: true,
        });

        res.json({ count });
    } catch (err) {
        console.error("Failed to get salvation count:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;