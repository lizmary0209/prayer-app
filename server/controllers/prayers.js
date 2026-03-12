const Prayer = require("../models/Prayer");

const updatePrayer = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { id } = req.params;
        const { title, description, scripture } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const prayer = await Prayer.findById(id);

        if (!prayer) {
            return res.status(404).json({ message: "Prayer not found" });
        }

        if (prayer.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You cna only edit your own prayers."});
        }

        if (title !== undefined) prayer.title = title;
        if (description !== undefined) prayer.description = description;
        if (scripture !== undefined) prayer.scripture = scripture;

        const updatedPrayer = await prayer.save();
        await updatedPrayer.populate("createdBy", "displayName profilePic");

        return res.json({ prayer: updatedPrayer });
    } catch (err) {
        console.error("updatePrayer error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    updatePrayer,
};