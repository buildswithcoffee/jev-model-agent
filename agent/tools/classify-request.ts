import { evaluate } from "eve/ai";
import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * What the shopper specifically needs. jev picks one of these keys.
 *
 * This does not route the model. auto() in agent/agent.ts already picked this
 * turn's model from the broad category; this narrows the request down so the
 * reply can address the specific need.
 */
const SUB_NEEDS = {
  Shopping_sizing: "Wants help choosing a size or checking fit.",
  Shopping_style: "Wants help choosing a style, color, or look.",
  Shopping_occasion: "Shopping for a specific event, season, or gift.",
  Product_specs: "Asking about a product's materials, dimensions, or features.",
  Product_availability: "Asking whether a product is in stock or when it will be.",
  Support_checkout: "Something went wrong placing an order or paying.",
  Support_account: "Trouble signing in or with their account.",
  Return_in_store: "Wants to return or exchange an item at a store.",
  Return_online: "Wants to return or exchange an item by mail or online.",
  Promo_code: "Has a promo code or asks whether one applies.",
  Promo_sales: "Asking what sales or deals are running.",
} as const;

export default defineTool({
  description:
    "Identify the shopper's specific need using jev. Use whenever the user " +
    "describes a problem, question, or shopping request.",

  inputSchema: z.object({
    request: z.string().min(1).max(8000),
  }),

  async execute({ request }, ctx) {
    const { answers } = await evaluate({
      model: "typesafe-ai/jev",
      state: { request },
      questions: {
        need: {
          type: "choice",
          instructions: "What does the shopper specifically need?",
          criteria: SUB_NEEDS,
        },
      },
      abortSignal: ctx.abortSignal,
    });

    return {
      need: answers.need.choice,
      probabilities: answers.need.probabilities ?? null,
    };
  },

  label: {
    start: ({ request }) => `Asking jev for the specific need: ${request}`,
    complete: (_input, output) => `jev chose ${output.need}`,
  },
});
