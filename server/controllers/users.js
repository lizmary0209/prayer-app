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

        return res.json(user);
    } catch (err) {
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
        if (displayName !== undefined) update.displayName = displayName;
        if (profilePic !== undefined) update.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(userId, update, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(updatedUser);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const recordSalvation = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.salvationDate) {
            user.salvationDate = new Date();
            await user.save();
        }

        return res.status(200).json({
            message: "Welcome to the family of God. Your salvation has been recorded.",
            user,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getMe, updateMe, recordSalvation };