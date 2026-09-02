Anthropic's extended thinking feature gives Claude a configurable scratchpad to reason through problems before producing a final response. It's controlled via the API with two parameters: enabling the `thinking` block and setting a `budget_tokens` limit.

## How It Works in the API

Extended thinking is enabled by passing a `thinking` configuration object to the messages API:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # max thinking tokens Claude may use
    },
    messages=[{
        "role": "user",
        "content": "A train leaves Chicago at 60 mph heading east. "
                   "Another leaves New York at 80 mph heading west. "
                   "The cities are 790 miles apart. When do they meet?"
    }]
)

# Response contains both thinking and text blocks
for block in response.content:
    if block.type == "thinking":
        print("Thinking:", block.thinking)
    elif block.type == "text":
        print("Answer:", block.text)
```

## Streaming Extended Thinking

For a better user experience, stream the response. Thinking blocks stream separately from the final answer:

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "Explain the halting problem."}]
) as stream:
    for event in stream:
        if hasattr(event, "type"):
            if event.type == "content_block_start":
                if hasattr(event.content_block, "type"):
                    block_type = event.content_block.type
                    print(f"\n[{block_type.upper()} BLOCK]")
            elif event.type == "content_block_delta":
                delta = event.delta
                if hasattr(delta, "thinking"):
                    print(delta.thinking, end="", flush=True)
                elif hasattr(delta, "text"):
                    print(delta.text, end="", flush=True)
```

## Understanding Budget Tokens

`budget_tokens` sets the **maximum** number of thinking tokens Claude may use — it won't always use all of them. Claude allocates as much thinking as the task seems to require, up to the budget.

| Budget | Use Case |
|--------|----------|
| 1,000–2,000 | Simple structured reasoning (JSON parsing, short math) |
| 4,000–8,000 | Moderate complexity (code review, multi-step problems) |
| 10,000–16,000 | Hard problems (complex algorithms, long-form analysis) |
| 32,000+ | Very hard problems (competitive math, research-level tasks) |

**Cost reality**: thinking tokens are billed at the same rate as output tokens. A 10,000-token thinking budget on a hard question may cost significantly more than a simple completion.

## Designing Prompts for Extended Thinking

Standard prompt engineering tricks (few-shot examples, [chain-of-thought](/guides/chain-of-thought) instructions) can actually hurt extended thinking by over-constraining the model's internal process. Let the model think freely:

```python
# Bad — tells the model HOW to think step by step
prompt = """
Think through this step by step:
Step 1: Identify the variables
Step 2: Set up the equation
Step 3: Solve
Question: ...
"""

# Better — just ask the question clearly
prompt = """
What is the optimal allocation strategy for this portfolio?
[portfolio details here]
"""
```

The model's internal scratchpad is already structured — you don't need to scaffold it further. Reserve explicit step-by-step instructions for cases where you need the *output* formatted that way.

## When NOT to Use Extended Thinking

- **Simple tasks**: Translation, summarization, extraction — thinking adds latency and cost with no quality gain
- **Latency-sensitive paths**: If your SLA requires sub-second responses, thinking is incompatible
- **High-throughput batch jobs**: Thinking multiplies token costs; avoid for bulk processing
- **Creative tasks**: Extended thinking is most valuable for verifiable correctness; creative writing doesn't benefit the same way

Use extended thinking when the task has a correct answer you care deeply about, and when you can afford the latency.
