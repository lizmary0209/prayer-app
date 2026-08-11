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
            awaitingFirstPrayer,
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
            Prayer.countDocuments({
                visibility: "public",
                prayedCount: 0,
            }),
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
            awaitingFirstPrayer,
        });
     } catch (error) {
        console.error("Admin statistics error:", error);

        res.status(500).json({
            message: "Unable to load admin statistics.",
        });
     }
    }
);

router.get(
    "/recent-prayers",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const recentPrayers = await Prayer.find({
                visibility: "public",
            })
            .sort({ createdAt: -1 })
            .limit(5);

            res.status(200).json({
                prayers: recentPrayers,
            });
        } catch (error) {
            console.error("Recent prayers error:", error);

            res.status(500).json({
                message: "Unable to load recent prayers.",
            });
        }
    }
);

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const users = await User.find()
            .select(
                "displayName email profilePic role salvationStatus salvationDate salvationDateEstimated createdAt "
            )
            .sort({ createdAt: -1 });

            res.status(200).json({
                users,
            });
        } catch (error) {
            console.error("Admin users error:", error);

            res.status(500).json({
                message: "Unable to load users.",
            });
        }
    }
);

module.exports = router;