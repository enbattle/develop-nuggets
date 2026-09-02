Fine-tuning is one of four strategies for adapting a model to your use case. Picking the wrong one burns weeks of engineering time and budget for little gain, so it's worth being deliberate about the choice.

## The Four Strategies

| Strategy | What It Changes | Time to Value | Cost |
|----------|----------------|---------------|------|
| **Prompting** | Nothing — model unchanged | Hours | Lowest |
| **RAG** | Knowledge access, not model weights | Days | Low to medium |
| **Fine-Tuning** | Model weights updated for new behavior | Weeks to months | Medium to high |
| **Continued Pre-Training** | Train on large domain corpus | Months | Very high |

## The Most Common Mistake

Fine-tuning when RAG would work. Teams reach for fine-tuning to "give the model company knowledge" — but fine-tuned models forget facts almost as quickly as base models. Fine-tuning teaches **behavior**, not **knowledge**. If you want the model to know your internal documentation, use RAG.

```
Fine-tuning is for:  "How should the model respond?"
RAG is for:          "What should the model know?"
Prompting is for:    "What should the model do right now?"
```

## When Fine-Tuning Wins

Fine-tuning has a genuine advantage in specific scenarios:

**1. New output format or style**
The model needs to produce outputs in a format or register it doesn't reliably produce from prompting alone (strict JSON schemas, specialized markdown, proprietary DSLs).

**2. Domain-specific vocabulary and reasoning**
Medical, legal, financial, or scientific domains where the model needs to consistently use precise terminology and reason correctly within domain constraints.

**3. Latency reduction**
A fine-tuned smaller model can match a larger model's quality on a narrow task — without the retrieval step. If your RAG pipeline adds 200ms to every request, a fine-tuned model may serve the same quality faster.

**4. Privacy requirements**
If the task requires processing sensitive data that cannot be sent to a retrieval system or a third-party API, a locally-hosted fine-tuned model avoids data leaving your environment.

**5. Consistent instruction-following**
If a complex system prompt needs to be followed reliably across thousands of calls, fine-tuning the behavior in beats repeating the instruction every time.

## Decision Matrix

```
Does the task require knowledge that changes frequently?
  YES → RAG (or RAG + fine-tuning)
  NO ↓

Does the model already produce the correct format/style from a good prompt?
  YES → Prompt engineering (you're done)
  NO ↓

Do you have 100+ high-quality labeled examples of correct behavior?
  NO → Collect data first, then revisit
  YES ↓

Is inference latency critical and can you host the model yourself?
  YES → Fine-tune a smaller model
  NO → Fine-tune via API (Claude, OpenAI fine-tuning) or hosted service
```

## Cost Reality Check

Fine-tuning costs show up in four places:

1. **Data collection**: 500–5,000 high-quality examples. If hand-labeled by experts, this is expensive.
2. **Compute**: A full fine-tuning run on a 7B parameter model takes hours on a single A100. Managed fine-tuning APIs (Anthropic, OpenAI) abstract this but charge per token.
3. **Iteration**: First fine-tunes rarely nail it. Budget for 3–5 iteration cycles.
4. **Ongoing hosting**: A fine-tuned model you host costs money every hour it's running, whether it's handling requests or not.

Before committing to fine-tuning, confirm you've exhausted prompting and RAG — and that the quality delta justifies the multi-week cycle.

Once you've decided to fine-tune, the choices from here are [LoRA / QLoRA](/guides/lora-qlora) for the training method, [instruction fine-tuning](/guides/instruction-finetuning) and [DPO](/guides/dpo) for what you're teaching, and [distillation](/guides/distillation) when a stronger model can supply the data.
