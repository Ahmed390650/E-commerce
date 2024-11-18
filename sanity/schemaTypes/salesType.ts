import { TagIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const salesType = defineType({
  name: "sale",
  title: "Sale",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Sale Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Sale description",
      type: "text",
    }),
    defineField({
      name: "discountAmount",
      title: "discount Amount",
      type: "number",
      description: "Amount of in percentage or fixed value",
    }),
    defineField({
      name: "couponCode",
      type: "string",
      title: "coupon Code",
    }),
    defineField({
      name: "validFrom",
      type: "datetime",
      title: "valid From",
    }),
    defineField({
      name: "validUnitl",
      title: "valid Unitl",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "isActive",
      description: "Toggle to active/deactive the sale",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
    },
    prepare({ couponCode, discountAmount, isActive, title }, viewOptions) {
      const status = isActive ? "Active" : "Inactive";
      return {
        title,
        subtitle: `${discountAmount}% off - Code: ${couponCode}  - ${status}`,
      };
    },
  },
});
