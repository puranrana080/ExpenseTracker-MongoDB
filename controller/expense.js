const Expense = require("../model/expense");
const path = require("path");
const User = require("../model/user");

require("dotenv").config();
const AWS = require("aws-sdk");
const S3Services = require("../services/S3services");
const FilesDownloaded = require("../model/filesdownloaded");
const mongoose = require("mongoose");

exports.getExpenseFrom = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/add_expense.html"));
};

exports.postAddExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  console.log("req.user", req.user);
  try {
    session.startTransaction();
    if (req.body.amount == undefined || req.body.amount === 0) {
      return res.status(400).json({ message: "Parameter missing" });
    }
    const expense = new Expense({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: req.user._id,
    });
    await expense.save({ session });

    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { totalAmount: req.body.amount } },
      { session }
    );

    await session.commitTransaction();

    console.log(expense);

    return res.status(200).json({
      expenseData: expense,
      message: "Expense added in db",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Failed to add expense and update total user",
    });
  }
};

const ITEM_PER_PAGE = 4;
exports.getExpense = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || ITEM_PER_PAGE;

    const totalItems = await Expense.countDocuments({ userId: req.user._id });

    const expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("limit", expenses);

    res.status(200).json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: limit * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const expenseId = req.params.Id;
    session.startTransaction();

    const expense = await Expense.findById({ _id: expenseId });
    const deletedAmount = expense.amount;
    console.log(deletedAmount);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { totalAmount: -expense.amount } },
      { session }
    );

    await Expense.deleteOne({ _id: expenseId }, { session });
    await session.commitTransaction();

    return res.status(200).json({ message: "Expense deleted from db" });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ message: "failed to delete" });
  }
};

exports.downloadexpense = async (req, res) => {
  try {
    if (!req.user.isPremiumUser) {
      console.log("User is not authorizes as not premium user");
      return res.status(401).json({ message: "user not authorized" });
    }

    const expenses = await Expense.find({ userId: req.user._id });

    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.name;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);

    const files = new FilesDownloaded({
      userId: req.user._id,
      fileDownloadedURL: fileURL,
    });
    await files.save();
    return res.status(200).json({ fileURL });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong", err });
  }
};
