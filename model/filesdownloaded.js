const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileDownloadedSchema = new Schema({
  fileDownloadedURL: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("FilesDownloaded", fileDownloadedSchema);
