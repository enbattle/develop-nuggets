## Structured Outputs

LLMs generate free-form text; production systems need structured data. The gap is a class of reliability bug that only shows up at scale: valid JSON on 99.8% of calls, then one malformed response that crashes the parser on the request that mattered.

## Approach 1: Tool Use (Native Anthropic)

Force structure by defining the desired output as a tool the model must call. Anthropic's tool use API guarantees the tool call arguments match the declared JSON schema — no parsing needed.

```python
import anthropic, json

client = anthropic.Anthropic()

extract_tool = {
    "name": "extract_invoice",
    "description": "Extract structured invoice data from the provided text.",
    "input_schema": {
        "type": "object",
        "properties": {
            "vendor":     {"type": "string"},
            "amount":     {"type": "number"},
            "currency":   {"type": "string", "enum": ["USD", "EUR", "GBP"]},
            "date":       {"type": "string", "description": "ISO 8601 date"},
            "line_items": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["vendor", "amount", "currency", "date"]
    }
}

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[extract_tool],
    tool_choice={"type": "tool", "name": "extract_invoice"},  # Force this exact tool
    messages=[{"role": "user", "content": f"Extract invoice from:\n{raw_text}"}]
)

for block in response.content:
    if block.type == "tool_use":
        data = block.input   # Already a valid dict — no json.loads() needed
        print(data["vendor"], data["amount"])
```

## Approach 2: Instructor + Pydantic (Recommended for Complex Schemas)

The Instructor library wraps the Anthropic client to guarantee a Pydantic model response, with automatic retry on validation failure.

```python
import anthropic
import instructor
from pydantic import BaseModel, Field

class Invoice(BaseModel):
    vendor: str
    amount: float = Field(gt=0)
    currency: str
    date: str
    line_items: list[str] = []

client = instructor.from_anthropic(anthropic.Anthropic())

invoice = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    response_model=Invoice,       # Instructor injects schema and retries on failure
    messages=[{
        "role": "user",
        "content": f"Extract invoice details from:\n{raw_text}"
    }]
)

print(invoice.vendor)       # Guaranteed str
print(invoice.amount)       # Guaranteed float > 0
print(invoice.line_items)   # Guaranteed list[str]
```

Instructor handles schema injection, JSON parsing, Pydantic validation, and retries with the validation error message so the model can self-correct.

## Approach 3: Grammar-Constrained Decoding (Self-Hosted)

For self-hosted models, constrain the token sampling process itself so invalid output is structurally impossible — no retries ever needed.

```python
from outlines import models, generate
from pydantic import BaseModel

class Invoice(BaseModel):
    vendor: str
    amount: float
    currency: str

model = models.transformers("meta-llama/Llama-3.1-8B-Instruct")
generator = generate.json(model, Invoice)

invoice = generator(f"Extract invoice from: {raw_text}")
# Output is guaranteed valid — the sampler cannot produce anything else
```

## Comparison

| Approach | Reliability | Notes |
|----------|------------|-------|
| Tool use (forced) | 99.9% | Best for Anthropic API; schema enforced by API layer |
| Instructor | 99%+ | Auto-retry handles remaining failures; works with any provider |
| Grammar-constrained | 100% | Requires self-hosted model; zero retries |
| Plain JSON prompt | 95–99% | Fragile; occasional preamble or malformed response |

**Default**: forced tool use for Anthropic apps. Instructor for multi-provider or Pydantic-first codebases.

For a high-volume extraction workload where even Instructor's retry rate costs too much, [fine-tuning a smaller model](/guides/structured-outputs-finetuning) for schema compliance is the next step.
