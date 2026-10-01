# Jev Model Agent Example on Eve Vercel AI Gateway

A retail support agent built with [eve](https://eve.dev). It uses jev, TypeSafe's classification model, to choose which model answers each message.

All model calls, including the calls to jev, go through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

## How it works

Each message goes through jev twice.

1. **Pick the model.** Before the turn starts, `auto()` in `agent/agent.ts` asks jev to put the message in one of five categories. eve then runs the turn on the model set for that category.
2. **Find the specific need.** The agent calls the `classify-request` tool. It asks jev a narrower question, such as whether a return is in store or online. The agent shows the need and its probabilities, then answers.

| Category | Model |
| --- | --- |
| Personal_shopping | google/gemini-3.5-flash |
| Product_details | openai/gpt-5-nano |
| Technical_support | openai/gpt-5.6-sol |
| Refunds_and_exchanges | google/gemini-3.5-flash |
| Promotions | openai/gpt-5.6-luna-fast |

The skills in `agent/skills/` are separate from routing. The model loads one with `load_skill` when a message matches the skill's description.

Here is the routing step:

```ts
// agent/agent.ts
import { defineAgent } from "eve";
import { auto } from "eve/models";

export default defineAgent({
  model: auto({
    model: "typesafe-ai/jev",
    options: {
      Personal_shopping: {
        model: "google/gemini-3.5-flash",
        description: "Wants help choosing what to buy, including size or fit.",
      },
      // ...four more categories
    },
  }),
});
```

## Requirements

- Node.js 24 or later
- A [Vercel account](https://vercel.com/signup) with access to AI Gateway

## Setup

### 1. Clone and install

```bash
git clone <this-repo-url>
cd simple-agent-with-jev
npm install
```

### 2. Start the agent

```bash
npm run dev
```

This opens the eve terminal UI.

### 3. Connect to AI Gateway

eve connects to AI Gateway through your Vercel account. No API key is needed.

1. In the terminal UI, type `/login`.
2. Choose **Vercel Account**.
3. Finish signing in in the browser.
4. Pick the Vercel team that should pay for the model calls.

eve saves the connection, so you only do this once.

## Try it

Send messages like these in the terminal UI:

- how do I start a return?
- what size should I get in this jacket?
- my checkout keeps failing

For each message, the chat shows the specific need jev chose and its probabilities. The footer shows the model the message was routed to, for example `dynamic model · google/gemini-3.5-flash`.

## Change the agent

| File | What it does |
| --- | --- |
| `agent/agent.ts` | The categories and the model for each one |
| `agent/tools/classify-request.ts` | The list of specific needs jev picks from |
| `agent/instructions.md` | What the agent does and what it shows |
| `agent/skills/` | Guidance the model loads when it fits the message |

To send a category to a different model, change its `model` in `agent/agent.ts`. eve reloads your changes while `npm run dev` is running.

## Deploy to Vercel

```bash
npm run deploy
```

If the folder is not linked yet, this signs you in to Vercel and walks you through picking a team and project. It then deploys to production.

On Vercel, the deployment reaches AI Gateway through the project's OIDC credentials, so there is nothing else to set up.

To chat with the deployed agent, point the terminal UI at its URL:

```bash
npx eve dev https://your-project.vercel.app
```

The agent does not accept browser requests in production yet. To build a web front end, replace `placeholderAuth()` in `agent/channels/eve.ts` with a real auth provider. See [Authentication](https://eve.dev/docs/guides/auth-and-route-protection).

## Troubleshooting

- **No model connection:** Run `/login` in the terminal UI and choose **Vercel Account**.
- **Vercel Account login fails:** Account access to AI Gateway is not available on every team. Run `/login` again and pick a different team.
- **Model not found:** Check the model IDs in `agent/agent.ts`. The jev model ID is `typesafe-ai/jev`.

## Learn more

- [eve docs](https://eve.dev/docs)
- [Automatic model selection with jev](https://eve.dev/docs/guides/evaluate)
- [eve skills](https://eve.dev/docs/skills)
- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
