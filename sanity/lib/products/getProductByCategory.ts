import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const getProductByCategory = async (slug: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
        *[_type=="product" &&
         references(*[_type=="category" && slug.current==$slug]._id)] 
        |order(name asc)`);
  try {
    const products = await sanityFetch({
      params: {
        slug,
      },
      query: PRODUCTS_BY_CATEGORY_QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Can not find Product by catergory", error);
    return [];
  }
};

export default getProductByCategory;
