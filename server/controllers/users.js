const User = require("../models/User");

const getMe = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const user = await User.findById(userId).select("-password");


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateMe = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const { displayName, profilePic } = req.body;

        const update = {};
        if (typeof displayName === "string" && displayName.trim()) {
            update.displayName = displayName.trim();
        }
        if (typeof profilePic === "string") {
             update.profilePic = profilePic.trim();
        }

        const updatedUser = await User.findByIdAndUpdate(userId, update, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const recordSalvation = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const {
            salvationStatus,
            salvationDate,
            salvationDateEstimated,
            salvationTestimony,
        } = req.body;

        if (!["saved_today", "already_saved", "exploring"].includes(salvationStatus)) {
            return res.status(400).json({ message: "Invalid salvation status" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.salvationStatus = salvationStatus;
        user.salvationRecordedAt = new Date();

        if (salvationTestimony !== undefined) {
            user.salvationTestimony = salvationTestimony;
        }

        if (salvationStatus === "saved_today") {
            user.salvationDate = new Date();
            user.salvationDateEstimated = false;

            if (!user.countedInSalvationCounter) {
                user.countedInSalvationCounter = true;

                   // TODO:
        // Increment your global salvation counter here
            }

            await user.save();

            return res.status(200).json({
                message: "Welcome to the family of God. Your salvation has been recorded.",
                user,
            });
        }

         if (salvationStatus === "already_saved") {
        user.salvationDate = salvationDate ? new Date(salvationDate) : null;
        user.salvationDateEstimated = Boolean(salvationDateEstimated);
        user.countedInSalvationCounter = false;

        await user.save();

        return res.status(200).json({
            message: "Your salvation journey has been saved to your profile.",
            user,
        });
    }


    if (salvationStatus === "exploring") {
        user.salvationDate = null;
        user.salvationDateEstimated = false;
        user.countedInSalvationCounter = false;

        await user.save();

        return res.status(200).json({
            message: "You are always welcome here. Take your time — God is near.",
            user,
        });
    }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getMe, updateMe, recordSalvation };