import { instance } from "../index.js";
import crypto from "crypto";

export const checkout = async (amount) => {
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  // console.log(`Order from chekout backend: ${order}`);
  return order;
};

export const paymentVerification = async (
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  return isAuthentic;
};
