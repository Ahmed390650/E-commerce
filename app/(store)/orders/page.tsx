import { formateCurrent } from "@/lib/formateCurrent";
import imgeurl from "@/lib/imgeurl";
import getMyOrders from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const OrderPage = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/");
  const orders = await getMyOrders(userId);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl  shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          My Orders
        </h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>You have not placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-8">
            {orders.map(
              ({
                orderDate,
                orderNumber,
                status,
                currency,
                totalPrice,
                amountDiscount,
                products,
              }) => (
                <div
                  key={orderNumber}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-bold">
                          OrderNumber
                        </p>
                        <p className="font-mono text-sm text-green-600 break-all">
                          {orderNumber}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="font-medium">
                          {orderDate
                            ? new Date(orderDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${status === "paid" ? "bg-green-100 text-green-899" : "bg-gray-100 text-gray-800"}`}>
                          {status}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Total Amount
                        </p>
                        <p className="font-bold text-lg">
                          {formateCurrent(totalPrice || 0, currency)}
                        </p>
                      </div>

                      {amountDiscount ? (
                        <div className="mt-4 sm:p-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                            Discount Applied:{" "}
                            {formateCurrent(amountDiscount, currency)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Orginal Subtotal:{" "}
                            {formateCurrent(
                              (totalPrice ?? 0) + amountDiscount,
                              currency
                            )}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-4 py-3 sm:px-6 sm:py-4">
                    <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                      Order Items
                    </p>
                    <div className="space-x-3 sm:space-y-4">
                      {products?.map((item) => (
                        <div
                          key={item.product?._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                        gap-3 py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {item.product?.image && (
                              <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={imgeurl(item.product.image).url()}
                                  alt={`${item.product.name}`}
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-sm sm:text-base">
                                {item.product?.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity ?? "N/A"}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-right ">
                            {item.product?.price && item.quantity
                              ? formateCurrent(item.product.price, currency)
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;