## What are Reasoning Models?

A new class of language models has emerged that can allocate additional compute at inference time to think through problems before answering. Unlike standard completion models, reasoning models maintain an internal scratchpad — a stream of "thinking tokens" — before producing a final response.

## The Shift from Completion to Reasoning

Standard LLMs are trained to predict the next token as efficiently as possible. They are fast and cheap, but they struggle with tasks that require multi-step logic, backtracking, or systematic exploration.

Reasoning models flip this tradeoff: they spend more tokens thinking, and those thinking tokens are never shown to the user. The result is dramatically better performance on hard tasks at the cost of higher latency and token usage.

## What Are Thinking Tokens?

Thinking tokens are the model's internal scratchpad — a chain of intermediate reasoning steps that the model generates before producing a final answer. They are:

- **Hidden**: Not shown to the end user in a standard completion
- **Unconstrained**: The model can explore dead ends, self-correct, and try multiple approaches
- **Billed**: They consume tokens and incur cost, even though they aren't visible
- **Configurable**: Most reasoning APIs let you set a budget for how many thinking tokens the model may use

```
Standard model:
  prompt → [single forward pass] → answer

Reasoning model:
  prompt → [think: step 1... step 2... try again... step 3...] → answer
```

## Why Test-Time Compute Matters

The dominant paradigm in AI scaling has been training-time compute: more parameters, more data, more GPU hours. Reasoning models introduce a second axis — **test-time compute** (also called inference-time compute).

Key insight: for a given hard problem, a smaller model given a thinking budget can outperform a larger model that must answer immediately. This fundamentally changes how you architect AI systems — throwing a bigger model at a problem is not always the right answer.

## The 2026 Reasoning Model Landscape

| Model | Provider | Approach |
|-------|----------|----------|
| Claude (extended thinking) | Anthropic | Native thinking tokens, configurable budget |
| o1 / o3 | OpenAI | Chain-of-thought trained with RL, hidden scratchpad |
| DeepSeek R1 | DeepSeek | RL-trained reasoning, fully open source |
| Gemini 2.0 Flash Thinking | Google | Streaming thinking process |

Each uses a different training approach to teach the model to think before answering, but the user-facing behavior is similar: longer latency, better answers on hard tasks.

## When to Use a Reasoning Model

| Situation | Recommendation |
|-----------|----------------|
| Complex math, logic puzzles, or multi-hop reasoning | Use reasoning model |
| Code debugging or architecture decisions | Use reasoning model |
| Simple Q&A, summarization, extraction | Standard model (faster, cheaper) |
| Latency-sensitive paths (real-time chat, voice) | Standard model |
| High-stakes decisions where errors are costly | Reasoning model |

The core tradeoff: reasoning models cost more per query and are slower. They are the right choice when correctness matters more than cost or latency.
