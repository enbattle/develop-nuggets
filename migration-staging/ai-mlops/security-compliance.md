## Security & Compliance for AI Systems

Protecting data and meeting regulatory requirements.

## Key Security Threats

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Prompt injection | User input manipulates LLM behavior | Input validation, sandboxing |
| Data leakage | PII exposed in responses | PII detection and redaction |
| Model inversion | Extracting training data from model | Differential privacy, output filtering |
| Unauthorized access | Accessing data without permission | Auth, RBAC, audit logging |
| Supply chain attacks | Compromised dependencies | Dependency scanning, signing |

## 1. Input Validation & Sanitization

```python
import re
from typing import Optional

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"ignore all prior instructions",
    r"you are now",
    r"pretend you are",
    r"act as",
    r"jailbreak",
]

def validate_input(user_input: str, max_length: int = 2000) -> tuple[bool, Optional[str]]:
    """Validate and sanitize user input."""
    # Length check
    if len(user_input) > max_length:
        return False, "Input too long"

    # Injection pattern check
    lower = user_input.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            return False, "Input contains disallowed patterns"

    return True, None

def sanitize_input(text: str) -> str:
    """Remove potentially harmful content."""
    # Remove HTML/script tags
    text = re.sub(r'<[^>]+>', '', text)
    # Limit special characters
    text = re.sub(r'[^\w\s.,!?;:\'"-]', '', text)
    return text.strip()
```

## 2. PII Detection and Redaction

```python
import re

PII_PATTERNS = {
    "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "phone": r'\b(\+?1[-.]?)?(\(?[0-9]{3}\)?[-.]?)[0-9]{3}[-.]?[0-9]{4}\b',
    "ssn": r'\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b',
    "credit_card": r'\b[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}\b',
}

def detect_pii(text: str) -> list[tuple[str, str]]:
    """Return list of (pii_type, matched_value)."""
    found = []
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.findall(pattern, text)
        found.extend([(pii_type, m if isinstance(m, str) else m[0]) for m in matches])
    return found

def redact_pii(text: str) -> str:
    """Replace PII with redaction markers."""
    for pii_type, pattern in PII_PATTERNS.items():
        text = re.sub(pattern, f"[REDACTED_{pii_type.upper()}]", text)
    return text

# Use in pipeline
def safe_query(user_input: str) -> str:
    valid, error = validate_input(user_input)
    if not valid:
        return f"Invalid input: {error}"

    sanitized = redact_pii(user_input)
    return rag.query(sanitized)
```

## 3. Authentication & Authorization

```python
import jwt, os
from functools import wraps
from datetime import datetime, timedelta

SECRET_KEY = os.environ["JWT_SECRET"]

def create_token(user_id: str, roles: list[str]) -> str:
    payload = {
        "user_id": user_id,
        "roles": roles,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def require_auth(required_role: str = None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(request, *args, **kwargs):
            token = request.headers.get("Authorization", "").replace("Bearer ", "")
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                if required_role and required_role not in payload.get("roles", []):
                    return {"error": "Insufficient permissions"}, 403
                request.user = payload
            except jwt.InvalidTokenError:
                return {"error": "Invalid token"}, 401
            return fn(request, *args, **kwargs)
        return wrapper
    return decorator
```

## 4. Audit Logging

```python
import json, uuid
from datetime import datetime

class AuditLogger:
    def __init__(self, log_file: str):
        self.log_file = log_file

    def log(self, event: str, user_id: str, details: dict):
        entry = {
            "event_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "event": event,
            "user_id": user_id,
            "details": details,
        }
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

audit = AuditLogger("audit.jsonl")

# Log every AI interaction
def audited_query(user_id: str, query: str) -> str:
    audit.log("query", user_id, {"query_hash": hash(query), "query_length": len(query)})
    response = rag.query(query)
    audit.log("response", user_id, {"response_length": len(response)})
    return response
```

## Compliance Checklist

| Requirement | Implementation |
|-------------|----------------|
| Data encryption at rest | AES-256 for stored documents |
| Data encryption in transit | TLS 1.3 for all API calls |
| Access control | RBAC with least-privilege |
| Audit trail | Immutable audit logs |
| PII handling | Detect, redact, or anonymize |
| Data retention | Automated deletion after policy period |
| Incident response | Documented runbook, on-call rotation |
