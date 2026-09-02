## Fine-Tuning for Structured Outputs

Getting LLMs to reliably produce valid JSON, XML, or domain-specific schemas is one of the most common fine-tuning use cases. Base models produce inconsistent structure; a fine-tuned model can achieve near-perfect schema compliance.

## The Reliability Problem

A base model asked to extract data as JSON may:
- Produce valid JSON 85% of the time — failing 15% of requests
- Include extra prose before or after the JSON
- Use inconsistent key names across requests
- Omit required fields when information is absent
- Produce truncated JSON when output is long

In production, even a 2% failure rate on a million daily calls means 20,000 errors per day requiring retry or fallback logic.

## Three Approaches

**1. JSON mode (constraint-based)**
Some APIs enforce valid JSON at the decoding level. Fast, reliable, but limited to valid JSON — can't enforce specific schemas.

**2. Instructor library (prompt + retry)**
The Instructor library wraps Pydantic models around LLM calls with Pydantic validation and automatic retry — see the **LLM Core node** for a full implementation.

**3. Fine-tuning (highest reliability)**
For high-volume, latency-sensitive, or highly specific schema requirements, fine-tuning a smaller model produces consistent schema output with lower cost and latency than repeated retries on a large model.

## Building a Structured Output Dataset

```python
import anthropic
import json
from pydantic import BaseModel

client = anthropic.Anthropic()

# Generate training examples using a strong model
def generate_extraction_example(document: str, schema: type[BaseModel]) -> dict:
    schema_json = schema.model_json_schema()

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system=f"""Extract structured data from documents.
Always respond with valid JSON matching this schema exactly:
{json.dumps(schema_json, indent=2)}
Respond with only the JSON object — no prose, no markdown code blocks.""",
        messages=[{
            "role": "user",
            "content": document
        }]
    )

    try:
        extracted = json.loads(response.content[0].text)
        validated = schema(**extracted)  # validate against Pydantic schema
        return {
            "instruction": f"Extract data from this document:\n{document}",
            "output": validated.model_dump_json()
        }
    except Exception:
        return None  # discard failed extractions

# Build dataset from raw documents
documents = load_raw_documents()
examples = [ex for doc in documents if (ex := generate_extraction_example(doc, InvoiceExtraction))]
```

## Evaluation Metrics

Schema validity alone is insufficient. Measure:

| Metric | Definition | Target |
|--------|-----------|--------|
| **Schema validity rate** | % of outputs that parse as valid JSON matching the schema | >99% |
| **Field accuracy** | % of fields with correct values (vs. ground truth) | >95% |
| **Extraction precision** | Correct extractions / all extractions | >90% |
| **Extraction recall** | Correct extractions / all expected extractions | >90% |
| **Null handling** | % correct when a field is absent from the document | >90% |

## Real Use Cases

Structured output fine-tuning is particularly effective for:

- **Document extraction**: Invoices, contracts, medical records, resumes
- **Classification with metadata**: Label + confidence + reasoning
- **Entity recognition**: Names, dates, amounts with normalized formats
- **API response generation**: Models that call internal tools with specific argument schemas

For general structured output patterns without fine-tuning, see the Structured Outputs lesson in the LLM Core node.
