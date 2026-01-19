const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        reference: { type: String, required: true, trim: true },
        message: { type: String, default: "", trim: true },
        isPremade: { type: Boolean, default: false },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);