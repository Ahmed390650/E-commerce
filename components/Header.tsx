"use client";
import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useBasketStore } from "@/store/store";
const Header = () => {
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const { user } = useUser();
  const createClerkPassKey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (error) {
      console.error("Error", JSON.stringify(error, null, 2));
    }
  };
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2">
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0">
          Shoper
        </Link>
      </div>
      <Form
        action="/search"
        className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0">
        <input
          type="text"
          name="query"
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
          placeholder="Search for products"
        />
      </Form>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
        <Link
          href="/basket"
          className="flex-1 relative flex justify-center items-center sm:justify-start sm:flex-none space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <TrolleyIcon className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute rounded-full -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex justify-center items-center text-xs">
              {itemCount}
            </span>
          )}

          <span>My Basket</span>
        </Link>
        {/**User area */}
        <ClerkLoaded>
          {user && (
            <Link
              href="/orders"
              className="flex-1 relative flex justify-center items-center sm:justify-start sm:flex-none space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <PackageIcon className="w-6 h-6" />
              <span>My orders</span>
            </Link>
          )}
          {user ? (
            <div className="flex items-center space-x-2">
              <UserButton />
              <div className="hidden sm:block text-xs">
                <p className="text-gray-400">Welcome Back</p>
                <p className="font-bold">{user.fullName}</p>
              </div>
            </div>
          ) : (
            <SignInButton mode="modal"></SignInButton>
          )}
          {user?.passkeys.length === 0 && (
            <button
              onClick={createClerkPassKey}
              className="bg-white hover:bg-blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border">
              Create passkey
            </button>
          )}
        </ClerkLoaded>
      </div>
    </header>
  );
};

export default Header;
