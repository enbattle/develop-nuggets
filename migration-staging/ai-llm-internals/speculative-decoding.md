## Speculative Decoding

LLM decode is memory-bandwidth-bound: the GPU loads model weights from HBM for every single token generated, one at a time. Even on an H100, the GPU is underutilized between token generations because the memory system is the bottleneck, not the compute cores.

Speculative decoding exploits this idle compute. A small "draft" model proposes N tokens in N serial passes, then a large "target" model verifies all N in a single parallel forward pass — the same latency as generating 1 token normally.

## The Mechanism

```
Draft model (7B, fast):
  Context → proposes [T₁, T₂, T₃, T₄] in 4 serial passes (~4ms total)

Target model (70B, slow):
  [Context + T₁ + T₂ + T₃ + T₄] → runs one parallel forward pass (~4ms)
  → accepts T₁ and T₂, rejects T₃ (corrects to T₃'), discards T₄

Result: [T₁, T₂, T₃'] — 3 tokens generated in the time it takes to generate 1
```

When a draft token is rejected, the target model's correction at that position is used, and the draft is restarted. The output distribution is **mathematically identical** to the target model alone — speculative decoding is a pure efficiency gain with no quality trade-off.

## Acceptance Rate and Speedup

The key metric is the acceptance rate: the fraction of draft tokens the target model accepts.

| Workload | Typical acceptance | Throughput gain |
|----------|------------------|----------------|
| Code generation | 80–90% | 3–4× |
| Structured JSON/XML | 80–90% | 3–4× |
| Instruction following | 60–75% | 2–3× |
| Creative writing | 40–60% | 1.5–2× |
| Short outputs (< 20 tokens) | — | Minimal |

## Medusa: No Separate Draft Model

Medusa adds lightweight "draft heads" to the target model itself — one head per lookahead step. All heads run in parallel from the same hidden state, proposing multiple candidates simultaneously.

```
Standard decode:   [Head₀ → T₁] → [Head₀ → T₂] → [Head₀ → T₃]  (3 serial passes)
Medusa decode:     [Head₀ → T₁, Head₁ → T₂, Head₂ → T₃] in one pass → verify
```

Medusa achieves 2–3× speedup with no separate model to deploy. The heads are fine-tuned on top of a frozen base model.

## Enabling in vLLM and SGLang

Both frameworks support speculative decoding transparently — no application code changes required.

```python
from vllm import LLM, SamplingParams

# Option 1: N-gram draft (uses prompt context as draft — no separate model)
llm = LLM(
    model="meta-llama/Llama-3.1-70B-Instruct",
    speculative_model="[ngram]",
    num_speculative_tokens=5,
    ngram_prompt_lookup_max=4,
)

# Option 2: separate draft model (higher acceptance rate)
llm = LLM(
    model="meta-llama/Llama-3.1-70B-Instruct",
    speculative_model="meta-llama/Llama-3.2-1B-Instruct",
    num_speculative_tokens=5,
)

outputs = llm.generate(prompts, SamplingParams(temperature=0, max_tokens=500))
```

```bash
# SGLang — speculative decoding via CLI
python -m sglang.launch_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
  --speculative-draft-model meta-llama/Llama-3.2-1B-Instruct \
  --speculative-num-steps 5
```

## When It Makes Sense

Speculative decoding is most valuable for **interactive, long-output, single-user** scenarios: code generation, document drafting, report writing. It's less valuable for:
- **Short outputs** (< 20 tokens): not enough tokens to amortize the draft overhead
- **High-temperature creative tasks**: lower acceptance rate reduces gains
- **High-concurrency batch serving**: GPUs are already compute-bound from batch parallelism; speculative decoding adds memory pressure without proportional gain
