Guardrails are runtime controls that validate and filter LLM inputs and outputs. In an MLOps context they are a deployed component with an owner, a latency budget, and a log to review — not a one-time safety review. This page covers where they sit and how to operate them; [Guardrails Frameworks](/guides/guardrails-frameworks) covers the implementations.

## Two Layers

Every production AI system needs guardrails at two points:

```
User Input → [INPUT GUARDRAILS] → LLM → [OUTPUT GUARDRAILS] → Response
```

**Input guardrails** prevent dangerous or off-topic prompts from reaching the model.
**Output guardrails** catch problematic responses before they reach users.

## The Five Risk Categories

| Risk | Description | Guard Type |
|------|-------------|------------|
| **Prompt injection** | User input hijacks the system prompt | Input |
| **PII leakage** | Personal data exposed in responses | Both |
| **Topic drift** | Model answers out-of-scope questions | Input |
| **Hallucination** | Model fabricates facts | Output |
| **Toxic output** | Harmful, offensive, or unsafe content | Output |

Each maps to a dedicated guide: [Prompt Injection](/guides/prompt-injection), [PII Detection & Data Privacy](/guides/pii-privacy), [Content Moderation Pipelines](/guides/content-moderation), and [Output Validation & Structured Safety](/guides/output-validation).

## Operating Guardrails

1. **Fail safe** — when in doubt, block and log. Never silently pass bad input.
2. **Layer them** — input guardrails reduce load on output guardrails.
3. **Log everything** — blocked requests are signals. Review them weekly, and feed new attack strings into the [red-team](/guides/red-teaming) and [regression](/guides/prompt-regression-testing) suites.
4. **Keep them fast** — regex checks are microseconds; LLM-based judges add 300–1000ms. Put LLM judges last, and hold them to a latency budget like any other dependency.
5. **Version them** — a guardrail change is a deploy. It goes through the same CI gates and rollback path as a prompt or model change.
