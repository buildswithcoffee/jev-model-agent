import { evaluate } from "eve/ai";

/** What each category means. jev picks one of these keys. */
export const CATEGORIES = {
  Personal_shopping: "Wants help choosing what to buy.",
  Sizing: "Asking about size or fit.",
  Product_details: "Asking about a product's specs or availability.",
  Technical_support: "Something is broken or not working.",
  Refunds_and_exchanges: "Wants money back or to return an item.",
  Promotions: "Asking about discounts or deals.",
} as const;

export type Category = keyof typeof CATEGORIES;

export async function classifyCategory(text: string) {
  const { answers } = await evaluate({
    model: 'typesafe-ai/jev',

    state: text,

    questions: {
      category_classification: {
        type: 'choice',

        instructions: 'What category of request is this?',

        // Same criteria the model router uses. See agent/agent.ts.
        criteria: CATEGORIES,
      }
    }
  })

  return answers.category_classification;
}
