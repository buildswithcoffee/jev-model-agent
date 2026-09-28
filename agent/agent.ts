import { defineAgent } from "eve";
import { auto } from "eve/models";
import { CATEGORIES } from "./lib/category";

/**
 * The choice -> model mapping.
 *
 * jev classifies the incoming prompt into one of these categories (using the
 * descriptions in agent/lib/category.ts), and eve runs the turn on the model
 * sitting next to it. Re-point a category by editing its model here.
 */
export const ROUTING = {
  Personal_shopping:     { model: "google/gemini-3.5-flash",  description: CATEGORIES.Personal_shopping },
  Sizing:                { model: "openai/gpt-5-nano",        description: CATEGORIES.Sizing },
  Product_details:       { model: "openai/gpt-5-nano",        description: CATEGORIES.Product_details },
  Technical_support:     { model: "openai/gpt-5.6-sol",       description: CATEGORIES.Technical_support },
  Refunds_and_exchanges: { model: "google/gemini-3.5-flash",  description: CATEGORIES.Refunds_and_exchanges },
  Promotions:            { model: "openai/gpt-5.6-luna-fast", description: CATEGORIES.Promotions },
} as const;

export default defineAgent({
  model: auto({
    options: ROUTING,
  }),
});
