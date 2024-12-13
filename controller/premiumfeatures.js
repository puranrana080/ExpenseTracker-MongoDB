const User = require("../model/user");

const FilesDownloaded = require("../model/filesdownloaded");

exports.getUserLeaderBoard = async (req, res) => {
  try {
    const leaderBoardOfUsers = await User.find().select("name totalAmount");

    console.log(leaderBoardOfUsers);
    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUserDownloadList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userDownloads = await FilesDownloaded.find({ userId: userId });

    return res.status(200).json({ userDownloads });
  } catch (err) {
    console.log("error fetch user downloads", err);
    return res.status(500).json({ message: "something wrong", error: err });
  }
};
