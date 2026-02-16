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

        const { name, avatar } = req.body;

        const update = {};
        if (name !== undefined) update.name = name;
        if (avatar !== undefined) update.avatar = avatar;

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

module.exports = { getMe, updateMe };