const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/check",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.status(200).json({
            message: "Admin access confirmed",
            isAdmin: true,
        });
    }
);

module.exports = router;