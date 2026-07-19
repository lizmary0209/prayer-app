const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, maxlength: 50, select: false },
    displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 30 },
    profilePic: { type: String, default: "", trim: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    salvationStatus: {
      type: String,
      enum: ["saved_today", "already_saved", "exploring"],
      default: null,
    },
    salvationDate: {
      type: Date,
      default: null,
    },
    salvationDateEstimated: {
      type: Boolean,
      default: false,
    },
    salvationRecordedAt: {
      type: Date,
      default: null,
    },
    countedInSalvationCounter: {
      type: Boolean,
      default: false,
    },
    salvationTestimony: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;


  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", UserSchema);

