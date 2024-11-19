import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      type: "string",
      title: "Order Number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stripeCheckoutSessionId",
      type: "string",
      title: "stripe Checkout Session Id",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "stripe Customer Id",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "store User ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "customer Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "stripe Payment Intent Id",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              price: "product.price",
              image: "product.image",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity} `,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "total Price",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount ",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "status",
      title: "Order status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currentcy: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare({ amount, currentcy, email, name, orderId }) {
      const orderIdSnipeed = `${orderId.slice(0, 5)}...${orderId.slice(-5)}`;
      return {
        title: `${name} (${orderIdSnipeed})`,
        subtitle: `${amount} ${currentcy}, ${email}`,
        media: BasketIcon,
      };
    },
  },
});
