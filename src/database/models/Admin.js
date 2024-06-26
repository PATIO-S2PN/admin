const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    email: {type: String, required: true},
    password:  {type: String, required: true},
    salt:  {type: String, required: true},
    firstName:  {type: String},
    lastName: {type: String},
    phone: {type: String, required: true},
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    otp: {type: Number},
    otp_expiry: {type: Date},
    role: { type: String, default: "staff" },
    profilePicture: { type: String },

  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", AdminSchema);
