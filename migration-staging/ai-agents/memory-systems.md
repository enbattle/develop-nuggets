## Agent Memory Systems

Memory determines how much context and history an agent can use.

## Types of Memory

| Type | What It Stores | Scope | Implementation |
|------|----------------|-------|----------------|
| **Working memory** | Current task, recent steps | Current session | Message list |
| **Episodic memory** | Past tasks, outcomes | Across sessions | Database + retrieval |
| **Semantic memory** | Domain knowledge, facts | Long-term | Vector database |
| **Procedural memory** | How to do tasks, learned patterns | Long-term | Few-shot examples |

## 1. Working Memory (In-Context)

The simplest form — the message list sent with each LLM call.

```python
class WorkingMemory:
    def __init__(self, max_tokens: int = 4000):
        self.messages = []
        self.max_tokens = max_tokens

    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
        self._trim_if_needed()

    def _trim_if_needed(self):
        """Keep recent messages within token budget."""
        while self._estimate_tokens() > self.max_tokens and len(self.messages) > 2:
            self.messages.pop(1)   # Remove oldest (keep system prompt)

    def _estimate_tokens(self) -> int:
        return sum(len(m["content"]) // 4 for m in self.messages)

    def get(self) -> list:
        return self.messages
```

## 2. Episodic Memory (Persistent)

Store and retrieve past task summaries across sessions:

```python
import json, chromadb
from sentence_transformers import SentenceTransformer

class EpisodicMemory:
    def __init__(self):
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        client = chromadb.Client()
        self.collection = client.get_or_create_collection("agent_episodes")

    def store(self, task: str, result: str, outcome: str):
        summary = f"Task: {task}\nResult: {result}\nOutcome: {outcome}"
        embedding = self.embed_model.encode(summary).tolist()
        self.collection.add(
            documents=[summary],
            embeddings=[embedding],
            ids=[f"episode_{datetime.now().timestamp()}"],
            metadatas=[{"task": task, "outcome": outcome, "timestamp": datetime.now().isoformat()}]
        )

    def recall(self, current_task: str, n: int = 3) -> list[str]:
        """Find past episodes similar to current task."""
        query_emb = self.embed_model.encode(current_task).tolist()
        results = self.collection.query(query_embeddings=[query_emb], n_results=n)
        return results['documents'][0]
```

```python
# Using episodic memory in an agent
memory = EpisodicMemory()

# Before starting a task
past_episodes = memory.recall(current_task)
context = f"Similar past tasks:\n{chr(10).join(past_episodes)}"

# After completing
memory.store(task=current_task, result=answer, outcome="success")
```

## 3. Summarization for Long Contexts

When context grows too long, summarize rather than truncate:

```python
def summarize_history(messages: list, keep_recent: int = 5) -> list:
    """Compress old messages into a summary."""
    if len(messages) <= keep_recent + 2:
        return messages

    old_messages = messages[1:-keep_recent]   # Skip system prompt + keep recent
    summary = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Summarize this conversation in 3-5 bullet points:\n\n{format_messages(old_messages)}"
        }]
    ).content[0].text

    return [
        messages[0],   # System prompt
        {"role": "user", "content": f"[Previous conversation summary]:\n{summary}"},
        *messages[-keep_recent:]
    ]
```

## Memory Retrieval Strategy

For agents with large knowledge stores, use RAG-style retrieval to pull relevant memories:

```python
def get_relevant_context(task: str, memory: EpisodicMemory, working_memory: WorkingMemory) -> str:
    past_episodes = memory.recall(task, n=3)
    current_steps = working_memory.get_summary()

    return f"""## Relevant Past Experience
{chr(10).join(past_episodes)}

## Current Session
{current_steps}"""
```

## Best Practices

- **Working memory** — always include; trim from the middle, not the end
- **Episodic memory** — store outcomes, not just actions (what worked and what didn't)
- **Summarization** — prefer summarizing old steps over truncating; models use early context
- **Token budget** — track token usage explicitly; don't let context quietly overflow
