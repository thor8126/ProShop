import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModal.js";
import { checkout, paymentVerification } from "../utils/razorpay.js";

// @desc           Create new order
// @routes         POST / api/orders
// @access         private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc           Get logged in user orders
// @routes         GET / api/orders/myorders
// @access         private
const getMyOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  res.status(200).json(order);
});

// @desc           Get order by id
// @routes         GET / api/orders/:id
// @access         private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc           Update order to paid
// @routes         put / api/orders/:id/pay
// @access         private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    (order.isPaid = true), (order.paidAt = Date.now());
    // (order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // });
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc           Checkout order create new order
// @routes         POST / api/orders/checkout
// @access         private
const checkoutOrder = asyncHandler(async (req, res) => {
  // console.log("inside checkoutOrder");
  const { amount } = req.body;
  const order = await checkout(amount);
  res.status(200).json(order);
});

// desc           payment verification
// routes         POST / api/orders/paymentverification
// access         private
const paymentverificationOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  // console.log(req.params.id);
  // console.log(req.body);
  // console.log("inside paymentverificationOrder");
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const isAuthentic = await paymentVerification(
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  );
  if (isAuthentic) {
    if (order) {
      (order.isPaid = true), (order.paidAt = Date.now());
      await order.save();
    }
    // res.status(200).json({ message: "Payment Successful" });
    res.redirect(`http://localhost:5173/order/${req.params.id}`);
  }
});

// @desc           Update order to delivered
// @routes         put / api/orders/:id/deliver
// @access         private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    (order.isDelivered = true), (order.deliveredAt = Date.now());
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc           Get all orders
// @routes         GET / api/orders
// @access         private/admin
const getOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({}).populate("user", "id name");
  res.status(200).json(order);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  checkoutOrder,
  paymentverificationOrder,
};
