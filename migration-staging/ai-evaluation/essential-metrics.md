## Essential Evaluation Metrics

Choose metrics based on your system type. Never rely on a single number.

## Text Generation Metrics

### Exact Match
Does output exactly match the expected answer?
```python
def exact_match(predicted: str, expected: str) -> float:
    return 1.0 if predicted.strip().lower() == expected.strip().lower() else 0.0
```
**Good for:** Factual Q&A, classification. **Limitation:** Too strict for open-ended responses.

### BLEU / ROUGE
Measures n-gram overlap with reference text.
- **BLEU** — precision-focused, used for translation
- **ROUGE-L** — recall-focused, used for summarization

**Limitation:** Neither captures semantic meaning. "The dog bit the man" and "The man bit the dog" score similarly.

### LLM-as-Judge Score (1–10)
Use another model to assess subjective quality.
**Good for:** Open-ended responses, tone, reasoning quality.
**Limitation:** Model biases — validate against human labels.

## Retrieval Metrics (RAG)

### Precision@k
Of the top-k results, what % are actually relevant?
```python
def precision_at_k(retrieved: list, relevant: list, k: int) -> float:
    top_k = retrieved[:k]
    return sum(1 for doc in top_k if doc in relevant) / k
```
*Target: >70% at k=5.*

### Recall@k
Of all relevant documents, what % did you retrieve?
```python
def recall_at_k(retrieved: list, relevant: list, k: int) -> float:
    top_k = retrieved[:k]
    return sum(1 for doc in top_k if doc in relevant) / len(relevant)
```
*Target: >60% at k=5.*

### Mean Reciprocal Rank (MRR)
How early does the first relevant result appear?
```python
def mrr(retrieved_lists: list[list], relevant_lists: list[list]) -> float:
    scores = []
    for retrieved, relevant in zip(retrieved_lists, relevant_lists):
        for i, doc in enumerate(retrieved, 1):
            if doc in relevant:
                scores.append(1 / i)
                break
        else:
            scores.append(0)
    return sum(scores) / len(scores)
```
*Good for: when position of first relevant result matters.*

## RAG End-to-End Metrics

### Faithfulness
Is the answer supported by retrieved context? Your primary hallucination detector.
```python
def evaluate_faithfulness(context: str, answer: str) -> dict:
    prompt = f"""Does the answer only use information from the context?
Context: {context}
Answer: {answer}
Respond: {{"is_faithful": true/false, "reason": "..."}}"""
    # Parse LLM response
```
*Target: >90%. Don't deploy below 70%.*

### Answer Relevancy
Does the answer address the user's actual question?
*Target: >80%.*

### Context Relevancy
Are retrieved documents actually relevant to the query?
*Target: >70%.*

## Agentic Metrics

For agent-specific evaluation dimensions and implementations — goal completion rate, tool correctness, step efficiency, reasoning quality, and multi-turn coherence — see the **Agent Evaluation** lesson in the Agent System node.

## Reference Thresholds

| Metric | Good | Warning |
|--------|------|---------|
| Exact Match | >80% | <60% |
| LLM-as-Judge | >7/10 | <5/10 |
| Precision@5 | >70% | <50% |
| Recall@5 | >60% | <40% |
| Faithfulness | >90% | <70% |
| Answer Relevancy | >80% | <60% |
