## What are Evaluations?

An AI evaluation ("eval") is a systematic test that measures your model's performance, accuracy, and reliability — like unit tests, but for LLM outputs. Evals catch hallucinations, regressions, and quality drops before they reach users.

```
Input Prompt → Model → Output → Scoring Logic → Metric Score
```

## Why Evals Matter

Without evals, you can't:
- Know if a prompt change improved or hurt quality
- Detect regressions when you update your model or pipeline
- Build confidence before deploying changes
- Understand where your system fails and why

**With evals:** Every change is measurable. Every deployment is defensible.

## Types of Things to Evaluate

### RAG Systems
- **Retrieval quality:** Did we find the right documents?
- **Faithfulness:** Is the answer grounded in retrieved context (not hallucinated)?
- **Answer relevancy:** Does the answer address the question?

### Agentic AI
- **Tool correctness:** Did the agent choose the right tools?
- **Reasoning quality:** Is the chain of thought logical?
- **Goal completion:** Did the agent accomplish the task?
- **Multi-turn coherence:** Is context maintained across steps?

### General LLMs
- **Accuracy:** Is the answer correct?
- **Helpfulness:** Is the response useful to the user?
- **Safety:** Does the output follow guidelines?

## The Evaluation Loop

```
Build/Change System
        ↓
Run Eval Dataset
        ↓
Analyze Results & Failures
        ↓
Identify Improvements
        ↓
Apply Changes
        ↓ (repeat)
```

This loop is the core practice of ML engineering. The faster you can run it, the faster you improve.
