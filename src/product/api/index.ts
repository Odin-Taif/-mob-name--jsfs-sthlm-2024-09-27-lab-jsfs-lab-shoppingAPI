import express from "express";
import { readdir, readFile } from "fs/promises";

export const productRouter: express.Router = express.Router();

// we get the products from the db/development/products
// we get them async
//try and catch block is used here for error handling.

const products = async (dirPath: string) => {
  try {
    // first we read the files from the dir asyncrously
    const files = await readdir(dirPath);
    const products = await Promise.all(
      files.map(async (file) => {
        const content = await readFile(`${dirPath}/${file}`, "utf-8");
        return JSON.parse(content);
      })
    );

    return products;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

productRouter.get("/", async (req, res) => {
  const productsDir = "src/db/development/products";
  try {
    const productList = await products(productsDir);
    res.status(200).json(productList);
  } catch (error) {
    res.status(500).send("Error loading products");
  }
  res.status(200);
});
