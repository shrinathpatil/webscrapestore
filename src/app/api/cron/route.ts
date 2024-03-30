import { getConnected } from "@/database/connection";
import { Product } from "@/database/models";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    getConnected();
    const products = await Product.find();

    if (!products) {
      console.log("No products found!");
      return;
    }

    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const scrapedProduct = await scrapeAmazonProduct(product.url);
        if (!scrapedProduct) {
          console.log("no scraped product!");
          return;
        }
        const updatedPriceHistory = [
          ...product.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const newProduct = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updateProduct = await Product.findOneAndUpdate(
          { url: product.url },
          newProduct
        );

        const emailNotification = getEmailNotifType(scrapedProduct, product);

        if (emailNotification && updateProduct.users.length > 0) {
          const productInfo = {
            title: updateProduct.title,
            url: updateProduct.url,
          };
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotification
          );

          const userEmails = updateProduct.users.map((user: any) => user.email);

          await sendEmail(emailContent, userEmails);
        }
        return updateProduct;
      })
    );

    return NextResponse.json({
      message: "ok",
      data: updatedProducts,
    });
  } catch (error) {
    console.log(error);
  }
};
