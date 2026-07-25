const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const User = require("../models/User");
const Prayer = require("../models/Prayer");

router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
     try {
        const [
            totalUsers,
            totalPrayers,
            salvationDecisions,
            prayerResponseResult,
        ] = await Promise.all([
            User.countDocuments(),
            Prayer.countDocuments(),
            User.countDocuments({
                salvationStatus: "saved_today",
            }),
            Prayer.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$prayedCount",
                        },
                    },
                },
            ]),
        ]);

        const prayerResponses =
        prayerResponseResult.length > 0
        ? prayerResponseResult[0].total
        : 0;

        res.status(200).json({
            totalUsers,
            totalPrayers,
            salvationDecisions,
            prayerResponses,
        });
     } catch (error) {
        console.error("Admin statistics error:", error);

        res.status(500).json({
            message: "Unable to load admin statistics.",
        });
     }
    }
);

module.exports = router;