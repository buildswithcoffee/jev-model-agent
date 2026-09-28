import { classifyCategory } from "../lib/category";
import { ROUTING } from "../agent";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Classify a customer request into a support category using jev, and report " +
    "the model that category routes to. Use whenever the user describes a " +
    "problem, question, or shopping request.",

  inputSchema: z.object({
    request: z.string().min(1).max(8000),
  }),

  async execute({ request }) {
    const { choice, probabilities } = await classifyCategory(request);

    return {
      category: choice,
      // Looked up in the same table that routed this turn's model.
      model: ROUTING[choice].model,
      probabilities: probabilities ?? null,
    };
  },

  label: {
    start: ({ request }) => `Asking jev to classify: ${request}`,
    complete: (_input, output) =>
      `jev chose ${output.category} -> ${output.model}`,
  },
});
