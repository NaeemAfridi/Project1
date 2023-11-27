const mongoose = require("mongoose");

const { schema } = mongoose;

const commentShema = new schema(
  {
    content: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.SchemaType.ObjectId,
      ref: "blogs",
    },
    author: {
      type: mongoose.SchemaType.ObjectId,
      ref: users,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentShema, "comments");
