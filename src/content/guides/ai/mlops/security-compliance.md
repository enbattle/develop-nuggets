The attack-and-defense side of AI security — prompt injection, PII leakage, jailbreaks — lives in the Safety & Guardrails track. This page is the operational half: access control, audit trails, encryption, data residency, and the evidence an auditor asks for.

## Key Security Threats

| Threat | Where it's covered |
|--------|--------------------|
| Prompt injection | [Prompt Injection: Attack and Defense](/guides/prompt-injection) |
| Data leakage / PII in responses | [PII Detection & Data Privacy](/guides/pii-privacy) |
| Harmful or off-policy output | [Content Moderation Pipelines](/guides/content-moderation) |
| Model inversion / training-data extraction | Output filtering, differential privacy |
| Unauthorized access | Auth, RBAC, audit logging — below |
| Supply-chain compromise | Dependency scanning and signing in [CI/CD for AI](/guides/cicd-for-ai) |

## Authentication & Authorization

Every request to an AI endpoint carries an identity and a role. Gate tools and data by role, not just by endpoint — an agent that can call `delete_record` for an admin must not call it for a read-only user.

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

## Audit Logging

Log every AI-assisted decision that touches a user, with enough detail to reconstruct it later. Hash inputs and outputs rather than storing them verbatim; write to an append-only store.

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

def audited_query(user_id: str, query: str) -> str:
    audit.log("query", user_id, {"query_hash": hash(query), "query_length": len(query)})
    response = rag.query(query)
    audit.log("response", user_id, {"response_length": len(response)})
    return response
```

The [model-card and incident-response](/guides/ai-governance) side of this — who owns each system, what the disclosure policy is — sits in the Safety track's governance guide; the audit log is the raw material it draws on.

## Data Residency & Retention

- **Residency** — know which region every store (vector DB, logs, cache, prompt history) physically lives in. A customer contract or GDPR may forbid data leaving a region; a multi-region deployment has to pin AI data stores, not just replicate them.
- **Retention** — set a TTL on conversation logs, retrieved-context caches, and feedback data. "Keep everything forever" is a liability, not an asset.
- **Deletion** — a user deletion request has to reach embeddings and fine-tuning datasets, not just the primary database.
- **Vendor terms** — if the LLM provider processes regulated data, you need a data-processing agreement (a BAA for PHI) and confirmation that your traffic is excluded from provider training.

## Compliance Checklist

| Requirement | Implementation |
|-------------|----------------|
| Encryption at rest | AES-256 for every store, including vector DB and logs |
| Encryption in transit | TLS 1.3 for all API and inter-service calls |
| Access control | RBAC with least privilege, enforced at the tool boundary |
| Audit trail | Append-only logs, retained per policy, time-synced |
| Data residency | Every AI data store pinned to an approved region |
| Data retention | Automated deletion after the policy window |
| Secrets | In a secrets manager, never in prompts or tool output |
| Vendor | DPA / BAA in place; traffic excluded from provider training |
| Incident response | Documented runbook, on-call rotation, defined notification path |

SOC 2 Type II and the EU AI Act both want the same core evidence: that these controls exist, that they are monitored, and that you can show a history of them working.
