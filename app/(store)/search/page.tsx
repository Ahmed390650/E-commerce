import ProductGrid from "@/components/ProductGrid";
import searchProductByName from "@/sanity/lib/products/searchProductByName";
import React from "react";

const Search = async ({
  searchParams,
}: {
  searchParams: Promise<{
    query: string;
  }>;
}) => {
  const { query } = await searchParams;
  const products = await searchProductByName(query);
  if (!products.length) {
    return (
      <div className="bg-gray-100 flex items-center justify-start p-4 min-h-screen flex-col ">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for :{query}
          </h1>
          <p className="text-grey-600 text-center">
            Try searching with differnt keywords
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search query for {query}
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Search;
