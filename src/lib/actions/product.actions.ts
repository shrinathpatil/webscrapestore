"use server";

import { getConnected } from "@/database/connection";
import { Product } from "@/database/models";
import { EmailContent, User } from "@/types/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export const getProductById = async (id: string) => {
  try {
    getConnected();
    const product = await Product.findById(id);

    if (!product) {
      console.log("Product not found!");
      return null;
    }
    return product;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = async () => {
  try {
    getConnected();
    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
};

export const getSimilarProducts = async (id: string) => {
  try {
    getConnected();
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return null;
    }

    const similarProducts = await Product.find({ _id: { $ne: id } }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
};

export const addUserEmailToProduct = async (id: string, userMail: string) => {
  try {
    const product = await Product.findById(id);
    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userMail
    );

    if (!userExists) {
      product.users.push({ email: userMail });
      await product.save();
      const emailContent: EmailContent = await generateEmailBody(
        product,
        "WELCOME"
      );

      await sendEmail(emailContent, [userMail]);
      console.log("mail added to product!");
    }
  } catch (error) {
    console.log(error);
  }
};
