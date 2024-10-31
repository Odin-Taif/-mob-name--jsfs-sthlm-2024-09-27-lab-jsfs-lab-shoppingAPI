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
  if (!req.is("application/json")) {
    return res
      .status(400)
      .send("Invalid content type. Expected 'application/json'.");
  }
  try {
    const cartPath = path.join(cartDir, `${id}`);
    const cartData = await readFile(cartPath, "utf-8");
    const cart = JSON.parse(cartData);
    // console.log(cart);
    cart.products.push(req.body);
    await writeFile(cartPath, JSON.stringify(cart));
    res.status(204).send("Added a product to cart");
  } catch (error) {
    // console.log(error);
  }
});

const createNewCart = async (
  cartsDir: string,
  id: string,
  products: Product[]
) => {
  await mkdir(cartsDir, { recursive: true });
  await writeFile(`${cartsDir}/${id}`, JSON.stringify({ id, products }));
};
