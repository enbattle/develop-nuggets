## Guardrails

Guardrails are runtime controls that validate and filter LLM inputs and outputs. They protect your system against misuse, enforce behavioral boundaries, and reduce liability exposure.

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

For guardrail framework implementations — NeMo Guardrails, Guardrails AI, LLM Guard, and lightweight custom patterns — see the **Safety & Guardrails** node.

## When to Use a Framework vs Custom

| Use Custom | Use Framework |
|-----------|---------------|
| Single risk type to guard | Multiple risk types at once |
| Simple regex + LLM judge sufficient | Need 50+ pre-built validators |
| Full control over logic | Compliance audit trail required |
| <10k requests/day | High-throughput production |

## Guardrail Design Principles

1. **Fail safe** — when in doubt, block and log. Never silently pass bad input.
2. **Layer them** — input guardrails reduce load on output guardrails.
3. **Log everything** — blocked requests are signals. Review them weekly.
4. **Keep them fast** — regex checks are microseconds; LLM-based judges add 300–1000ms. Put LLM judges last.
5. **Test adversarially** — include jailbreak attempts and edge cases in your eval suite.
