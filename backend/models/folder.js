//this file defines the Mongoose schema and model for the Folder collection in the MongoDB database. Each folder has a name, an optional cover image URL, and a reference to the user who owns it. The schema also includes timestamps for when each folder is created and last updated.
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
