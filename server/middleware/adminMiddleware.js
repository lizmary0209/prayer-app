const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User ID missing from token",
            });
        }

        const user = await User.findById(userId).select("role");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }

        req.adminUser = user;

        next();
    } catch (err) {
        console.error("Admin authorization failed:", err);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = adminMiddleware;