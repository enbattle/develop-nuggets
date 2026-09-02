## Inference

Inference is the process of running a trained model to generate outputs. For LLMs, generation is **autoregressive**: the model produces one token at a time, and each new token depends on all previous ones.

## The Two Phases

Every LLM generation call has two distinct phases:

**Prefill** — The entire input prompt is processed in parallel. Fast; scales with input length.

**Decode** — Output tokens are generated one at a time. Each token requires a full forward pass.

```
Input:  [T1, T2, T3, T4]           ← all processed in parallel (prefill)
Output: [T5], [T6], [T7] ...       ← generated sequentially (decode)
```

This asymmetry is why long system prompts are cheap relative to long outputs. Prefill is compute-bound; decode is memory-bandwidth-bound.

## Throughput vs Latency

| Metric | Definition | Optimized By |
|--------|-----------|--------------|
| **Throughput** | Total tokens/second across all users | Large batch sizes |
| **TTFT** (time to first token) | Latency of the prefill phase | Fast hardware, short prompts |
| **TPOT** (time per output token) | Decode latency per token | Memory bandwidth, small batches |

You cannot maximize both simultaneously. Large batches increase throughput but add queuing delay. Single-user interactive apps want low TTFT; bulk pipelines want maximum throughput.

## Continuous Batching

Traditional **static batching** held a batch until every request completed — inefficient because short requests wait for long ones to finish.

**Continuous batching** (iteration-level scheduling) inserts new requests into a batch as soon as a slot opens, between decode steps:

```
Step N:   [Req A - token 5, Req B - token 1, Req C - token 9]
Req B finishes →
Step N+1: [Req A - token 6, Req D - token 1, Req C - token 10]
                              ↑ new request fills immediately
```

Combined with PagedAttention, continuous batching delivers **14–24× higher throughput** than naive static batching on the same hardware.

## Serving Frameworks (2026)

| Framework | Best For | Key Innovation | Notes |
|-----------|---------|---------------|-------|
| **vLLM** | High-throughput multi-user APIs | PagedAttention (virtual memory for KV cache) | Industry standard |
| **SGLang** | Agents, structured generation | RadixAttention (KV cache as radix tree for prefix sharing) | Fastest loop times for agentic workflows |
| **TGI** | HuggingFace ecosystem | Mature Rust backend, multi-GPU | Feature-frozen as of Dec 2025 |
| **llama.cpp / Ollama** | Local, edge, CPU | 4-bit GGUF, runs without GPU | Best for local development |

```python
# vLLM: production server (batch multiple requests)
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    tensor_parallel_size=2,           # span 2 GPUs
    enable_prefix_caching=True,       # cache repeated system prompts
)

outputs = llm.generate(
    ["Explain RAG in one sentence.", "What is a KV cache?"],
    SamplingParams(temperature=0, max_tokens=200)
)
for output in outputs:
    print(output.outputs[0].text)
```

```bash
# SGLang: best for agentic structured generation
python -m sglang.launch_server --model meta-llama/Llama-3.1-8B-Instruct --port 30000

# Ollama: local development
ollama run llama3.1:8b
```

## Hardware Reference

| Tier | GPU | VRAM | Fits |
|------|-----|------|------|
| **Production** | H100 80GB, A100 80GB | 80GB | 70B models at FP16, high concurrency |
| **Mid-tier** | A10G 24GB, L4 24GB | 24GB | 7B–13B models in production |
| **Consumer** | RTX 4090 24GB | 24GB | Local dev, 7B at FP16 |
| **CPU / Edge** | None | RAM | llama.cpp with 4-bit GGUF quantization |

**Sizing rule of thumb:** A model needs approximately **2 × parameter count in GB** at FP16. A 7B model needs ~14GB; a 70B model needs ~140GB (requires 2× A100s or quantization).
