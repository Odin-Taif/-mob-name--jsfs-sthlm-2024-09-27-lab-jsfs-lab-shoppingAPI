import express from "express";
import { mkdir, unlink, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../../e2e-types";
import { readFile } from "fs/promises";
import path from "path";
import { readdir } from "fs/promises";
import { itemSchema } from "./validation";

export const cartRouter: express.Router = express.Router();
const cartDir = "src/db/test/carts";

cartRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("Cart is empty.");
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/", async (req, res) => {
  const id = uuidv4();
  try {
    await createNewCart(`src/db/test/carts`, id, []);
    res.status(201).header("location", `/api/carts/${id}`).json({ id });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const filesInCartDir = await readdir(cartDir);
    if (filesInCartDir.includes(id)) {
      const cartPath = path.join(cartDir, `${id}`);
      const cartData = await readFile(cartPath, "utf-8");
      const cart = JSON.parse(cartData);
      return res.status(200).json(cart);
    } else {
      return res.status(404).send("Cart does not exist");
    }
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).send("Error retrieving cart");
  }
});

cartRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { error, value } = itemSchema.validate(req.body);
  const validatedProduct = value;
  if (error) {
    return res.status(400).send();
  }
  if (
    (!req.is("application/json") &&
      !req.is("application/x-www-form-urlencoded")) ||
    error
  ) {
    return res.status(400).send("Invalid content type.");
  }

  try {
    await addProductToCart(id, validatedProduct);
    return res.status(204).send("item has been added");
  } catch (error) {
    // console.log(error);
  }
});

cartRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cartPath = path.join(cartDir, `${id}`);
    const filesInCartDir = await readdir(cartDir);
    if (filesInCartDir.includes(id)) {
      await deleteFile(cartPath);
      return res.status(204).send("cart is deleted");
    } else {
      return res.status(204).send("");
    }
  } catch (error) {
    console.log(error);
  }
});

const addProductToCart = async (id, product) => {
  const cartPath = path.join(cartDir, `${id}`);
  const cartData = await readFile(cartPath, "utf-8");
  const cart = JSON.parse(cartData);
  cart.products.push(product);
  const uniqueProducts = cart.products.reduce((acc, prod) => {
    const existingProduct = acc.find((p) => p.id === prod.id);

    if (existingProduct) {
      existingProduct.quantity += prod.quantity;
    } else {
      acc.push({ ...prod });
    }

    return acc;
  }, []);
  cart.products = uniqueProducts;
  await writeFile(cartPath, JSON.stringify(cart));
};

const createNewCart = async (
  cartsDir: string,
  id: string,
  products: Product[]
) => {
  await mkdir(cartsDir, { recursive: true });
  await writeFile(`${cartsDir}/${id}`, JSON.stringify({ id, products }));
};

async function deleteFile(filePath) {
  try {
    await unlink(filePath);
    console.log(`File at ${filePath} was deleted successfully`);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
}
