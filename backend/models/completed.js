const { Schema, model } = require("mongoose");

const completedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      default : '',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
  },
  { timestamps: true },
);

const Completed = model("Completed", completedSchema);

module.exports = Completed;
