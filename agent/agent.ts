import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  /**
   * The category -> model mapping.
   *
   * Before each turn, jev reads the recent conversation and picks one of these
   * categories by its description, and eve runs the turn on the model next to
   * it. Re-point a category by editing its model here.
   */
  model: auto({
    model: "typesafe-ai/jev",
    options: {
      Personal_shopping: {
        model: "google/gemini-3.5-flash",
        description: "Wants help choosing what to buy, including size or fit.",
      },
      Product_details: {
        model: "openai/gpt-5-nano",
        description: "Asking about a product's specs or availability.",
      },
      Technical_support: {
        model: "openai/gpt-5.6-sol",
        description: "Something is broken or not working.",
      },
      Refunds_and_exchanges: {
        model: "google/gemini-3.5-flash",
        description: "Wants money back or to return an item.",
      },
      Promotions: {
        model: "openai/gpt-5.6-luna-fast",
        description: "Asking about discounts or deals.",
      },
    },
  }),
});
