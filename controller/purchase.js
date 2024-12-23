const RazorPay = require("razorpay");
const Order = require("../model/order");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 4900;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(err);
      }
      const orders = new Order({
        orderId: order.id,
        status: "PENDING",
        userId: req.user._id,
      });
      orders
        .save()
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentId: payment_id, status: "SUCCESSFUL" }
    );

    req.user.isPremiumUser = true;
    await req.user.save();

    return res.status(202).json({ message: "Transaction Successful" });
  } catch (err) {
    console.log("Error in updating transaction status", err);
    return res
      .status(500)
      .json({ message: "Transaction Failed", error: err.message });
  }
};

exports.updateTransactionStatusToFailed = async (req, res) => {
  try {
    const { order_id } = req.body;
    await Order.findOneAndUpdate({ orderId: order_id }, { status: "FAILED" });

    return res.status(200).json({ message: "Maked as failed" });
  } catch (err) {
    console.log("Error in updating", err);
    return res.status(500).json({
      message: "Failed to update transaction status",
    });
  }
};

exports.checkUserPremium = async (req, res) => {
  try {
    const user = await req.user;
    res.status(200).json({ isPremiumUser: user.isPremiumUser });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch", error: err.message });
  }
};
