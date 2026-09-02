## PII Detection & Data Privacy

Personally Identifiable Information (PII) in AI systems creates privacy risk, regulatory exposure, and trust erosion. PII can enter at three points: in RAG retrieval, in user inputs, and in LLM outputs. Each requires different mitigation.

## What PII Is and Why It Matters

**PII categories:**
- Direct identifiers: name, email, phone, SSN, passport number
- Quasi-identifiers: zip code + DOB + gender (combinable to re-identify)
- Sensitive categories: medical records, financial data, biometrics

**Regulatory exposure:**
- **GDPR**: Prohibits processing PII without lawful basis; requires data minimization
- **CCPA**: California consumers have the right to know what PII is collected and processed
- **HIPAA**: Health information (PHI) has strict handling requirements

In AI systems, PII violations can occur even without malicious intent — a RAG system that retrieves a document containing PII and includes it in an LLM prompt has "processed" that PII.

## PII in RAG: Preventing Leakage from Retrieved Content

The retrieval layer is the most common source of PII leakage in production:

```python
import re
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def redact_pii_from_chunk(text: str, language: str = "en") -> str:
    """Redact PII from a retrieved document chunk before including in prompt."""
    results = analyzer.analyze(
        text=text,
        language=language,
        entities=["PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER",
                  "US_SSN", "CREDIT_CARD", "US_BANK_NUMBER",
                  "LOCATION", "DATE_TIME"],
    )

    anonymized = anonymizer.anonymize(text=text, analyzer_results=results)
    return anonymized.text

def safe_rag_pipeline(query: str, retrieved_chunks: list[str]) -> str:
    # Redact PII from all retrieved chunks before building the prompt
    clean_chunks = [redact_pii_from_chunk(chunk) for chunk in retrieved_chunks]

    prompt = build_rag_prompt(query, clean_chunks)
    return call_llm(prompt)
```

## PII in User Inputs

Users often include PII in their messages (email addresses, phone numbers, medical info) without realizing it's being sent to an LLM or stored:

```python
def scan_and_handle_user_input(user_message: str) -> dict:
    results = analyzer.analyze(text=user_message, language="en")

    if results:
        pii_types = list(set(r.entity_type for r in results))

        # Option 1: Redact before sending to LLM
        clean_message = anonymizer.anonymize(text=user_message, analyzer_results=results).text

        # Option 2: Inform user and ask them to rephrase
        return {
            "action": "redact",
            "clean_message": clean_message,
            "pii_detected": pii_types,
            "user_notice": f"Your message contained {', '.join(pii_types)}. "
                          f"This information has been anonymized before processing.",
        }

    return {"action": "pass", "clean_message": user_message}
```

## PII in LLM Outputs

Even if inputs are clean, an LLM may hallucinate PII (e.g., generate a realistic-looking SSN) or regurgitate PII from its training data:

```python
def scan_llm_output(response: str) -> dict:
    results = analyzer.analyze(text=response, language="en")

    if results:
        # High-confidence PII in output — redact before returning to user
        high_confidence = [r for r in results if r.score > 0.85]

        if high_confidence:
            clean_response = anonymizer.anonymize(
                text=response,
                analyzer_results=high_confidence
            ).text
            return {
                "response": clean_response,
                "pii_detected_in_output": True,
                "flagged_types": [r.entity_type for r in high_confidence],
            }

    return {"response": response, "pii_detected_in_output": False}
```

## Secrets Management

Beyond PII, AI systems often have access to sensitive credentials — API keys, database passwords, service tokens. These must never appear in LLM messages:

```python
import os
from functools import lru_cache

# Bad: credentials in code or prompts
api_key = "sk-live-abc123..."  # Never do this

# Good: credentials via environment / secrets manager
@lru_cache(maxsize=1)
def get_credentials() -> dict:
    return {
        "db_password": os.environ["DB_PASSWORD"],
        "api_key": os.environ["EXTERNAL_API_KEY"],
    }

# When building tool call results, never include credentials in the LLM-visible output
def call_database(query: str) -> str:
    creds = get_credentials()
    result = db.execute(query, password=creds["db_password"])
    # Return result data only — not the connection string or credentials
    return format_result(result)
```

## Tools for PII Detection

| Tool | Strengths | Language Support |
|------|-----------|-----------------|
| **Presidio** (Microsoft) | Production-ready, extensible, good entity coverage | 15+ languages |
| **spaCy NER** | Fast, customizable, integrates with ML pipelines | Many languages |
| **Regex patterns** | Deterministic, zero latency, format-specific (SSN, phone) | Language agnostic |
| **Claude/LLM detection** | Context-aware, catches semantic PII (implied identity) | Any |
| **AWS Comprehend** | Managed service, no hosting burden | 12+ languages |

Best practice: combine regex (for high-precision structured PII like SSN, credit card) with a model-based detector (for context-dependent PII like names, addresses) for defense in depth.
