Running an agent in a notebook is three lines of code. Running it reliably under load — with retries, security controls, cost bounds, and zero-downtime deploys — is a different set of decisions.

## Deployment Topologies

### Synchronous API

Best for interactive agents where users wait for a response (< 30 seconds):

```
Client → API Gateway → Agent Service → [LLM API, Tools, State DB]
```

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class RunRequest(BaseModel):
    goal: str
    user_id: str
    max_iterations: int = 10

class RunResponse(BaseModel):
    run_id: str
    output: str
    total_tokens: int
    cost_usd: float

@app.post("/agent/run", response_model=RunResponse)
async def run_agent(req: RunRequest):
    run_id = generate_run_id()
    try:
        result = await agent.run(
            goal=req.goal,
            run_id=run_id,
            max_iterations=req.max_iterations,
        )
        return RunResponse(**result)
    except BudgetExceeded as e:
        raise HTTPException(status_code=402, detail=str(e))
    except AgentTimeout:
        raise HTTPException(status_code=504, detail="Agent timed out")
```

### Async Job Queue

Best for long-running agents (minutes to hours) — client polls for status or receives a webhook:

```
Client → API → Queue (SQS/Redis) → Worker Pool → [LLM, Tools, State]
                    ↓                                      ↓
              Run ID returned                    Webhook / status endpoint
```

```python
import asyncio
from celery import Celery

celery = Celery("agents", broker="redis://localhost:6379/0")

@celery.task(bind=True, max_retries=3)
def agent_task(self, goal: str, run_id: str):
    try:
        return agent.run_sync(goal=goal, run_id=run_id)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

# API endpoint — returns immediately
@app.post("/agent/submit")
async def submit(req: RunRequest):
    run_id = generate_run_id()
    agent_task.delay(req.goal, run_id)
    return {"run_id": run_id, "status_url": f"/agent/{run_id}/status"}
```

## Horizontal Scaling

Agent services are stateless request handlers — state lives in the checkpoint store. This makes horizontal scaling straightforward:

```
                        ┌─────────────┐
                        │ Load Balancer│
                        └──────┬───────┘
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
         Agent Pod 1     Agent Pod 2     Agent Pod 3
               │               │               │
               └───────────────┼───────────────┘
                               ▼
                      ┌─────────────────┐
                      │  State Store     │
                      │  (Redis/Postgres)│
                      └─────────────────┘
```

Each pod can resume any run because state is external. A pod crash loses at most one step, and the run resumes on a different pod on the next retry.

## Graceful Degradation

Define explicit fallback behaviors for each failure mode:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def call_llm_with_retry(messages: list) -> anthropic.types.Message:
    return client.messages.create(
        model="claude-sonnet-5",
        max_tokens=4096,
        messages=messages,
    )

def run_step_safe(state: AgentState) -> AgentState:
    try:
        return run_agent_step(state)
    except RateLimitError:
        time.sleep(60)
        return run_agent_step(state)
    except ContextWindowExceeded:
        state.messages = trim_messages(state.messages, tokenizer)
        return run_agent_step(state)
    except Exception as e:
        state.status = "failed"
        state.error = str(e)
        store.save(state)
        alert_oncall(state)
        raise
```

## Production Checklist

- [ ] State is persisted after every step (crash-safe)
- [ ] Total cost and token budget enforced per run
- [ ] All destructive tool calls are logged
- [ ] Retries with exponential backoff on transient failures
- [ ] Timeout set on both individual steps and total run duration
- [ ] Traces captured for every LLM call and tool call
- [ ] Alerts on error rate, latency P99, and cost per run
- [ ] Human approval gate for high-risk action types

For security controls — prompt injection defense, secrets management, PII handling — see [Prompt Injection](/guides/prompt-injection) and [PII Detection & Data Privacy](/guides/pii-privacy).
