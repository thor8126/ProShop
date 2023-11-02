import { apiSlice } from "./apiSlice";
import { ORDERS_URL, RAZORPAY_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
        method: "GET",
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    getRazorPayKey: builder.query({
      query: () => ({
        url: `${RAZORPAY_URL}`,
        method: "GET",
      }),
    }),
    razorPayCheckout: builder.mutation({
      query: (amount) => ({
        url: `${ORDERS_URL}/checkout`,
        method: "POST",
        body: { amount },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useGetRazorPayKeyQuery,
  useRazorPayCheckoutMutation,
} = ordersApiSlice;
