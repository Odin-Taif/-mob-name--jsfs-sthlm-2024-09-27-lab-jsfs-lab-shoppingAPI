import express from "express";

export const productRouter: express.Router = express.Router();

productRouter.get("/", (req, res) => {
  res.send("List of products");
});
