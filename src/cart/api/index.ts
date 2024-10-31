import express from "express";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../../e2e-types";
import { readdir, readFile } from "fs";

export const cartRouter: express.Router = express.Router();

cartRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("Cart is empty.");
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/", async (req, res) => {
  const id = uuidv4();
  createNewCart(`src/db/test/carts`, id);
  try {
    res
      .status(201)
      .header("location", `/api/carts/${id}`)
      .json({ id, products: [] });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  if (!req.is("application/json")) {
    return res
      .status(400)
      .send("Invalid content type. Expected 'application/json'.");
  }
});

const createNewCart = async (cartsDir: string, id: string) => {
  await mkdir(cartsDir, { recursive: true });
  await writeFile(`${cartsDir}/${id}`, JSON.stringify({ id, products: [] }));
};
