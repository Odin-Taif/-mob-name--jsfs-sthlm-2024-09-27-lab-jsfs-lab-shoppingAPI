import express from "express";
import { readdir, readFile } from "fs/promises";

export const productRouter: express.Router = express.Router();

const productsDir: string = "src/db/development/products";

const products = async (dirPath: string) => {
  try {
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
  const productsList = await products(productsDir);
  try {
    res.status(200).json(productsList);
  } catch (error) {
    console.log(error);
  }
});

productRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const productsList = await products(productsDir);
  try {
    const product = productsList.find((product) => product.id === id);
    if (!product) {
      res.status(404).end();
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
});
