import imgeurl from "@/lib/imgeurl";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";

const ProductThumb = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={` flex flex-col rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isOutOfStock ? "opacity-50" : ""}`}>
      <div className="relative aspect-square w-full h-full overflow-hidden">
        {product.image && (
          <Image
            src={imgeurl(product.image).url()}
            alt={`${product.name}`}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw ,33vw"
          />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p>
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join(" ") || "No description avaiable"}
        </p>
        <p className="mt-2 text-lg font-bold text-gray-900">
          ${product.price?.toFixed()}
        </p>
      </div>
    </Link>
  );
};

export default ProductThumb;
