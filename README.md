# simple-agent-with-jev

A retail support agent built with [eve](https://eve.dev). It uses jev, TypeSafe's evaluation model, to pick which model answers each request.

## How it works

Each request goes through two jev steps.

1. **Route the model.** Before the turn starts, `auto()` in `agent/agent.ts` asks jev to put the request in one of five categories. eve then runs the turn on the model listed for that category.
2. **Find the specific need.** The agent calls the `classify-request` tool, which asks jev a narrower question, like whether a return is in store or online. The agent prints the need and its probabilities, then answers.

The two steps answer different questions, so they never repeat each other's work.

Skills in `agent/skills/` are separate. The model loads one with `load_skill` when a request matches the skill's description.

All model calls, including jev, go through the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

| Category | Model |
| --- | --- |
| Personal_shopping | google/gemini-3.5-flash |
| Product_details | openai/gpt-5-nano |
| Technical_support | openai/gpt-5.6-sol |
| Refunds_and_exchanges | google/gemini-3.5-flash |
| Promotions | openai/gpt-5.6-luna-fast |

## Setup

You need Node.js 24 or newer and a Vercel account with AI Gateway access.

1. Clone the repo and install dependencies.

   ```bash
   git clone https://github.com/buildswithcoffee/simple-agent-with-jev.git
   cd simple-agent-with-jev
   npm install
   ```

2. Start the agent.

   ```bash
   npm run dev
   ```

3. If eve asks you to connect, run `/login` in the terminal UI. Choose your Vercel account, or paste an AI Gateway API key.

## Try it

Send a message such as:

- how do I start a return?
- what size should I get in this jacket?
- my checkout keeps failing

The chat shows jev's specific need and probabilities. The footer shows the model the request was routed to, for example `dynamic model · google/gemini-3.5-flash`.

## Project files

| File | What it does |
| --- | --- |
| `agent/agent.ts` | Categories and the model for each one |
| `agent/tools/classify-request.ts` | The list of specific needs jev picks from |
| `agent/instructions.md` | What the agent does and what it prints |
| `agent/skills/` | Guidance the model loads when it fits the request |

To send a category to a different model, change its `model` in `agent/agent.ts`.

## Deploy

```bash
npm run deploy
```

This links a Vercel project if needed and deploys to production. On Vercel, the deployment reaches the AI Gateway through the project's OIDC credentials. To host somewhere else, set `AI_GATEWAY_API_KEY`. See the [eve deployment docs](https://eve.dev/docs/guides/deployment/vercel).

## Learn more

- [eve documentation](https://eve.dev/docs)
- [Automatic model selection](https://eve.dev/docs/guides/evaluate)
- [Skills](https://eve.dev/docs/skills)
