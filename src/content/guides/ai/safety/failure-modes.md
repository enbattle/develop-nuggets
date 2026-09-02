Before you can build guardrails, you need a clear picture of what can go wrong — and how likely and severe each failure type is for your specific application.

## The Four Categories

### 1. Hallucination

The model generates plausible-sounding but incorrect content. Three distinct variants:

**Factual hallucination**: The model states something that is false as if it were true.
- Example: "The Eiffel Tower was built in 1889 by Claude Bernard."
- Impact: Misinformation at scale; liability in high-stakes domains

**Fabrication**: The model invents entities that don't exist.
- Example: A legal research tool cites "Johnson v. State (2019)" — a case that doesn't exist
- Impact: Especially dangerous in legal, medical, academic contexts

**Reasoning hallucination**: The model starts from correct facts but reaches a wrong conclusion through flawed logic.
- Example: Correct math setup, arithmetic error in a later step
- Impact: Hard to detect; the reasoning looks plausible

### 2. Harmful Outputs

The model produces content that causes real-world harm:

- **Misinformation**: False or misleading content presented as factual
- **PII leakage**: Returning private data from training or retrieved context
- **Unsafe content**: Violence, illegal activities, dangerous instructions
- **Biased outputs**: Systematically unfair treatment based on demographic attributes

### 3. Prompt Injection

An attacker manipulates the model's instructions by injecting adversarial content — through user input, retrieved documents, tool outputs, or any other channel reaching the model's context. See [Prompt Injection](/guides/prompt-injection) for full coverage.

### 4. Over-Refusal

The model refuses requests that are actually safe, frustrating users and reducing product utility. A model calibrated too conservatively for safety will refuse medical questions, legal questions, or any ambiguous-sounding request.

Over-refusal is a failure mode: a model that never produces harmful content but also refuses to be helpful has failed at its purpose.

## Risk Matrix

Evaluate each failure mode by severity and probability for your specific deployment:

| Failure Mode | Severity | Probability | Priority |
|-------------|----------|-------------|----------|
| Fabricated legal citations | Critical | Medium | P0 |
| PII leakage from RAG | Critical | Low-Medium | P0 |
| Prompt injection from web input | High | Medium | P1 |
| Factual hallucination | Medium | Medium-High | P1 |
| Over-refusal | Low | Medium | P2 |
| Biased outputs | Medium | Low | P2 |

## Why "The Model Said It" Doesn't Protect You

Organizations sometimes believe that if an AI produces harmful content unprompted, they bear no responsibility. This is legally incorrect in most jurisdictions and reputationally untenable:

- **EU AI Act**: Classifies AI systems by risk tier; high-risk AI must meet documentation, testing, and human oversight requirements
- **GDPR Article 22**: Prohibits fully automated decisions with significant effects on individuals without human review
- **Product liability**: Courts are increasingly treating AI outputs as product claims

Beyond legal risk, reputational damage from a public AI failure can permanently harm a brand. Build the safety architecture before deployment, not after the incident.

## How Risk Changes by Domain

| Domain | Primary Risk | Regulatory Exposure |
|--------|-------------|---------------------|
| Medical / clinical | Dangerous health advice | High (FDA, HIPAA) |
| Legal | Fabricated citations, incorrect advice | High (bar associations) |
| Financial | Incorrect investment advice | High (SEC, FINRA) |
| Education (children) | Inappropriate content | High (COPPA) |
| General consumer | Misinformation, bias | Medium |
| Internal enterprise tools | PII leakage, data exfiltration | Depends on data type |

Your risk matrix should be calibrated to your domain, not a generic template.
