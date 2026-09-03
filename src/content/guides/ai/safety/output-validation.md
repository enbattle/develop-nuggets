Unconstrained LLM generation is risky in production: the model can produce valid-looking but incorrect output, output in the wrong format, or output that violates your application's business rules. Output validation catches these failures before they reach users.

## Why Unconstrained Generation Is Risky

An agent that writes to a database, sends emails, or calls external APIs based on LLM output needs high confidence that the output is correctly structured and semantically valid. The cost of a parsing error in a customer email system or a financial transaction is much higher than the cost of an extra retry call.

## Schema Enforcement with Pydantic + Retry

The Instructor library wraps LLM calls with Pydantic validation and automatic retry; the focus here is safety-specific field validators and business-rule constraints:

```python
import anthropic
import instructor
from pydantic import BaseModel, Field, field_validator
from typing import Literal

client = instructor.from_anthropic(anthropic.Anthropic())

class CustomerTicket(BaseModel):
    category: Literal["billing", "technical", "account", "general"]
    priority: Literal["urgent", "high", "medium", "low"]
    summary: str = Field(min_length=10, max_length=200)
    requires_escalation: bool
    extracted_account_id: str | None = Field(
        default=None,
        description="Account ID if mentioned in the message"
    )

    @field_validator("extracted_account_id")
    @classmethod
    def validate_account_id(cls, v):
        if v and not v.startswith("ACC-"):
            raise ValueError("Account ID must start with 'ACC-'")
        return v

# Instructor handles retry logic automatically
ticket = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=500,
    response_model=CustomerTicket,
    max_retries=3,
    messages=[{
        "role": "user",
        "content": f"Classify this support message: {message}"
    }]
)

print(ticket.category, ticket.priority, ticket.requires_escalation)
```

If the model produces invalid output, Instructor passes the Pydantic validation error back to the model as context and retries — up to `max_retries` times.

## Grammar-Constrained Decoding

For self-hosted models, grammar-constrained decoding (Outlines library) enforces structure at the token generation level — the model literally cannot produce tokens that violate your schema, eliminating the need for retry logic entirely.

## Confidence Scoring and Abstention

Rather than always producing an answer, the model can express uncertainty and abstain:

```python
from pydantic import BaseModel

class AnswerWithConfidence(BaseModel):
    answer: str | None  # None means the model abstains
    confidence: float   # 0.0 to 1.0
    reason_for_abstention: str | None

def answer_with_abstention(question: str, min_confidence: float = 0.8) -> str:
    result = client.messages.create(
        model="claude-sonnet-5",
        response_model=AnswerWithConfidence,
        messages=[{
            "role": "user",
            "content": f"""Answer this question. If you're not confident (below {min_confidence}),
set answer to null and explain why.

Question: {question}

Respond with your confidence level honestly — do not answer if uncertain."""
        }]
    )

    if result.answer is None or result.confidence < min_confidence:
        return f"I'm not confident enough to answer this question. {result.reason_for_abstention}"

    return result.answer
```

## Refusal Detection

Over-refusal is also a [failure mode](/guides/failure-modes). Detect when the model has refused a safe request:

```python
def detect_refusal(response: str) -> bool:
    refusal_indicators = [
        "i can't help with",
        "i'm not able to",
        "i cannot assist",
        "i don't feel comfortable",
        "i'm unable to provide",
    ]
    response_lower = response.lower()
    return any(indicator in response_lower for indicator in refusal_indicators)

def answer_with_refusal_detection(question: str) -> dict:
    response = call_llm(question)

    if detect_refusal(response):
        # Log for review — may indicate over-refusal
        log_potential_over_refusal(question, response)

        # Try rephrasing or using a different model
        rephrased_response = call_llm(rephrase_safely(question))
        return {"response": rephrased_response, "was_initially_refused": True}

    return {"response": response, "was_initially_refused": False}
```

## Production Validation Wrapper

```python
from typing import TypeVar, Type
import anthropic
import instructor
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

client = instructor.from_anthropic(anthropic.Anthropic())

def validated_llm_call(
    prompt: str,
    response_model: Type[T],
    max_retries: int = 3,
    fallback_value: T | None = None,
) -> T | None:
    try:
        return client.messages.create(
            model="claude-sonnet-5",
            max_tokens=1000,
            response_model=response_model,
            max_retries=max_retries,
            messages=[{"role": "user", "content": prompt}]
        )
    except Exception as e:
        # Log the failure with full context
        log_validation_failure(prompt, response_model.__name__, str(e))

        if fallback_value is not None:
            return fallback_value

        return None
```
