const User = require('../model/user')
const Expense = require('../model/expense')
const sequelize = require('../util/user')
const FilesDownloaded = require('../model/filesdownloaded')




exports.getUserLeaderBoard = async (req, res) => {
    try {

        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'userName', 'total_cost'],
            // group: ['users.id'],
            order: [['total_cost', 'DESC']]
        })

        console.log(leaderboardofusers)
        res.status(200).json(leaderboardofusers)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

exports.getUserDownloadList = async (req, res, next) => {
    try {
        const userId = req.user.id
        console.log("This is user Id ", userId)
        const userDownloads = await FilesDownloaded.findAll({ where: { userId: userId } })

        return res.status(200).json({ userDownloads })


    }
    catch (err) {
        console.log("error fetch user downloads", err)
        return res.status(500).json({ message: "something wrong", error: err })

    }


}