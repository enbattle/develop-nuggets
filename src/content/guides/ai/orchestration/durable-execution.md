Standard code runs in a single process: if it crashes, restarts, or times out, you lose all in-memory state and must restart from scratch. For short scripts this is fine. For agentic workflows that take minutes or hours — making API calls, waiting for human approval, processing thousands of items — it's catastrophic.

Durable execution frameworks automatically checkpoint state to persistent storage at each step. On restart, execution resumes from the last checkpoint rather than from the beginning. The workflow logic looks like ordinary sequential code; the framework handles persistence, retries, and replay transparently.

## The Problem Without Durable Execution

```python
# Fragile: if this crashes at step 5 of 100, restart from step 1
def process_documents(doc_ids: list[str]):
    results = []
    for doc_id in doc_ids:
        content = fetch_document(doc_id)         # Network call — can fail
        embedding = embed_content(content)        # API call — can fail
        chunk_ids = store_chunks(embedding)       # DB write — can fail
        results.append(chunk_ids)
    return results
```

## Temporal: Durable Workflow Engine

Temporal checkpoints workflow state after each "activity" (external call). On failure or restart, the workflow replays from the last checkpoint — activities that already completed are not re-executed.

```python
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
import asyncio

@activity.defn
async def fetch_document(doc_id: str) -> str:
    """Activity: any external call. Temporal retries on failure."""
    return await http_client.get(f"/docs/{doc_id}")

@activity.defn
async def embed_content(content: str) -> list[float]:
    return await embedding_api.embed(content)

@activity.defn
async def store_chunks(doc_id: str, embedding: list[float]) -> list[str]:
    return await vector_db.upsert(doc_id, embedding)

@workflow.defn
class DocumentPipeline:
    @workflow.run
    async def run(self, doc_ids: list[str]) -> list[str]:
        all_chunk_ids = []
        for doc_id in doc_ids:
            # Each activity is checkpointed — failure here resumes from this doc
            content = await workflow.execute_activity(
                fetch_document, doc_id,
                start_to_close_timeout=timedelta(seconds=30)
            )
            embedding = await workflow.execute_activity(
                embed_content, content,
                start_to_close_timeout=timedelta(seconds=10)
            )
            chunk_ids = await workflow.execute_activity(
                store_chunks, doc_id, embedding,
                start_to_close_timeout=timedelta(seconds=5)
            )
            all_chunk_ids.extend(chunk_ids)
        return all_chunk_ids

async def main():
    client = await Client.connect("localhost:7233")
    result = await client.execute_workflow(
        DocumentPipeline.run,
        ["doc_1", "doc_2", "doc_3"],
        id="doc-pipeline-001",
        task_queue="main"
    )
```

## Alternatives

| Framework | Language | Hosted | Best for |
|-----------|----------|--------|---------|
| Temporal | Python, Go, Java, TypeScript | Self-hosted or Cloud | Complex multi-step workflows |
| Prefect | Python | Cloud or self-hosted | Data pipelines, ML workflows |
| Inngest | TypeScript | Cloud | Serverless event-driven workflows |
| AWS Step Functions | JSON state machine | AWS | AWS-native; visual editor |

## Human-in-the-Loop with Durable Execution

Durable execution enables [human-in-the-loop](/guides/human-in-the-loop) workflows that pause for approval — potentially for days — without holding any resources:

```python
@workflow.defn
class ApprovalWorkflow:
    @workflow.run
    async def run(self, order: dict) -> str:
        if order["amount"] > 10_000:
            # Signal-wait: workflow pauses here, releases all memory
            # Resumes when external signal arrives (human approves/rejects)
            approval = await workflow.wait_condition(
                lambda: self._approved is not None,
                timeout=timedelta(days=3)
            )
            if not self._approved:
                return "rejected"

        return await workflow.execute_activity(
            process_order, order,
            start_to_close_timeout=timedelta(minutes=5)
        )

    @workflow.signal
    def approve(self): self._approved = True

    @workflow.signal
    def reject(self): self._approved = False
```

The workflow can wait days with zero resource consumption. When the human clicks "Approve", Temporal sends a signal and the workflow resumes from exactly the point it paused.
