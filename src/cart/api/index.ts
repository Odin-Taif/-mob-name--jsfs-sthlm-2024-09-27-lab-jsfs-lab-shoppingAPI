import express from "express";

export const cartRouter: express.Router = express.Router();

cartRouter.get("/", async (req, res) => {
  try {
    res.status(200).send("Cart is empty.");
  } catch (error) {
    console.log(error);
  }
});
