const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/count", async (req, res) => {
    try {
        const count = await User.countDocuments({
            salvationDate: { $ne: null },
        });

        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;