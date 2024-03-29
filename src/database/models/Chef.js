const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChefSchema = new Schema(
  {
    name: {type: String},
    description:  {type: String},
    title:  {type: String},
    photo: { type: String },

  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("chef", ChefSchema);
