"use server";

import { getConnected } from "@/database/connection";
import { Product } from "@/database/models";
import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export const scrapeAndStoreProduct = async (productUrl: string) => {
  if (!productUrl) {
    return;
  }
  getConnected();
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    // console.log(scrapedProduct.stars);
    if (!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        {
          price: scrapedProduct.currentPrice,
        },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url,
      },
      product,
      { upsert: true, new: true }
    );

    console.log("product updated successfully!");
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error) {
    console.log(error);
  }
};
