import { client } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import ImageUrlBuilder from "@sanity/image-url";
const builder = ImageUrlBuilder(client);
const imgeurl = (source: SanityImageSource) => {
  return builder.image(source);
};

export default imgeurl;
