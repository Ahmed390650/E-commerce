import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getMyOrders = async (userId: string) => {
  if (!userId) throw new Error("user is is required");
  const MY_ORDERS_QUERY = defineQuery(`
        *[_type=="order" && clerkUserId==$userId] | order(orderData desc) {
            ...,
            products[]{
                ...,
                product->
            }
        }`);
  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: {
        userId,
      },
    });
    console.log(orders);
    return orders.data || [];
  } catch (error) {
    console.error("error fetching orders", error);
    return [];
  }
};

export default getMyOrders;
