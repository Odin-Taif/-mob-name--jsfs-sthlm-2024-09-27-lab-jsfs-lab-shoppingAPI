/*
 * You may use this validator to enforce data integrity in your API.
 */
import Joi from "@hapi/joi";

export const itemSchema = Joi.object().keys({
  id: Joi.string().required(),
  item: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
});

export function validateItem(obj: object) {
  return itemSchema.validate(obj);
}
