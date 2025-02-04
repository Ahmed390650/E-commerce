"use client";
import { Product } from "@/sanity.types";
import { AnimatePresence, motion } from "motion/react";
import ProductThumb from "./ProductThumb";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 ">
      {products.map((product) => {
        return (
          <AnimatePresence key={product._id}>
            <motion.div
              layout
              animate={{ opacity: 1 }}
              initial={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="flex justify-center">
              <ProductThumb product={product} key={product._id} />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default ProductGrid;
