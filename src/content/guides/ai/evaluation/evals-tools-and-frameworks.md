Once evaluation is continuous, doing it by hand stops scaling. These are the tools worth knowing.

## RAGAS — Purpose-Built for RAG Evaluation

Best tool for automating RAG-specific metrics.

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

eval_data = Dataset.from_dict({
    "question": ["What is RAG?", "How do embeddings work?"],
    "answer": ["RAG retrieves...", "Embeddings convert..."],
    "contexts": [["RAG is a technique..."], ["Embeddings are vectors..."]],
    "ground_truth": ["RAG stands for...", "Embeddings represent..."],
})

results = evaluate(eval_data, metrics=[faithfulness, answer_relevancy, context_precision])
print(results)
# {'faithfulness': 0.92, 'answer_relevancy': 0.87, 'context_precision': 0.81}
```

**Strengths:** Out-of-the-box RAG metrics, minimal setup.
**Limitations:** Limited to RAG use cases, requires ground truth.

## LangSmith — Tracing & Debugging

From LangChain. Excellent for observing what happens inside your pipeline.

```python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"

# Your LangChain code runs normally
# Every step is logged to LangSmith dashboard
# Inspect: what was retrieved, what prompt was sent, how long each step took
```

**Best for:** Debugging retrieval pipelines, inspecting prompts, tracing production errors.

## Braintrust — Evaluation Platform

End-to-end eval platform with dataset management, experiment tracking, and LLM-as-Judge.

```python
import braintrust

@braintrust.traced
def my_rag_pipeline(query: str) -> str:
    docs = retrieve(query)
    return generate(query, docs)

# Create eval
experiment = braintrust.Eval(
    "RAG-evaluation",
    data=lambda: load_eval_dataset(),
    task=my_rag_pipeline,
    scores=[braintrust.Factuality, braintrust.LLMClassifier("Faithfulness")]
)
```

**Best for:** Teams wanting a managed platform with built-in LLM judges and experiment comparison.

## Custom Evaluation Framework

For most teams, a lightweight custom solution works best:

```python
class EvalRunner:
    def __init__(self, llm_judge_model: str = "claude-sonnet-5"):
        self.judge = anthropic.Anthropic()
        self.judge_model = llm_judge_model

    def llm_judge(self, query: str, answer: str, criteria: str) -> float:
        prompt = f"""Score this answer 0.0–1.0 based on: {criteria}

Query: {query}
Answer: {answer}

Return only a number between 0 and 1."""
        response = self.judge.messages.create(
            model=self.judge_model,
            max_tokens=10,
            messages=[{"role": "user", "content": prompt}]
        )
        return float(response.content[0].text.strip())

    def run(self, system_fn, dataset: list) -> dict:
        results = []
        for ex in dataset:
            output = system_fn(ex["query"])
            results.append({
                "query": ex["query"],
                "output": output,
                "faithfulness": self.llm_judge(ex["query"], output, "faithfulness to context"),
                "relevancy": self.llm_judge(ex["query"], output, "relevance to the question"),
            })
        return aggregate(results)
```

## Tool Selection Guide

| Situation | Recommended |
|-----------|-------------|
| RAG system, automated metrics | **RAGAS** |
| Debugging retrieval pipeline | **LangSmith** |
| Team needs managed platform | **Braintrust** |
| Custom metrics, full control | **Custom + LLM-as-Judge** |
| Large-scale offline evaluation | **Custom + batch processing** |
