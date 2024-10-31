import express from "express";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../../e2e-types";
import { readFile } from "fs/promises";
import path from "path";

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
    const cartPath = path.join(cartDir, `${id}`);
    const cartData = await readFile(cartPath, "utf-8");
    const cart = JSON.parse(cartData);

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).send("Error retrieving cart");
  }
});

cartRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const product = req.body;

  if (
    !req.is("application/json") &&
    !req.is("application/x-www-form-urlencoded")
  ) {
    return res.status(400).send("Invalid content type.");
  }
  try {
    await addProductToCart(id, product);
    res.status(204).send("item has been added");
  } catch (error) {
    // console.log(error);
  }
});

const addProductToCart = async (id, product) => {
  const cartPath = path.join(cartDir, `${id}`);
  const cartData = await readFile(cartPath, "utf-8");
  const cart = JSON.parse(cartData);
  cart.products.push(product);
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
