const { Schema, model } = require("mongoose");

const folderSchema = new Schema(
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
  },
  { timestamps: true },
);

const Folder = model("Folder", folderSchema);

module.exports = Folder;
