In a standard dense transformer, all parameters are active for every token — a 70B model uses all 70B parameters per forward pass. Mixture of Experts (MoE) breaks this: a learned **gating network** routes each token to a subset of "expert" sub-networks, keeping most parameters inactive per token.

## Architecture

An MoE layer replaces the standard FFN (feed-forward network) with N parallel FFNs plus a gating network:

```
Standard FFN:                 MoE FFN layer:
                              Expert 1: FFN
Token → FFN → output          Expert 2: FFN
                              ...
                              Expert N: FFN
                                   ↑
                              Gating network:
                                Token → softmax → top-K selection
                                Weighted sum of top-K expert outputs
```

Typically K=2: each token activates exactly 2 experts. The other N-2 experts skip computation entirely.

## Frontier Models Are MoE

Most frontier models in 2026 use MoE architecture:

| Model | Total params | Active params/token | Experts |
|-------|-------------|---------------------|---------|
| Mixtral 8x7B | ~47B | ~13B | 8, top-2 |
| DeepSeek V3 | 671B | 37B | 256, top-8 |
| Qwen3 235B-A22B | 235B | 22B | 128, top-8 |

GPT-4 is widely believed to be a large MoE model, though OpenAI has not confirmed architecture details.

The "A22B" notation means 22B **A**ctive per token. For a given training compute budget, MoE consistently produces better models than dense because total parameter count grows without proportional compute cost — the training FLOP is bounded by active parameters.

## Serving Trade-offs

**Memory**: All expert weights must be loaded into GPU memory, even though only K are used per token. A 47B MoE model requires the same VRAM as a 47B dense model.

**Throughput**: Higher than an equivalent dense model because compute per token is lower (only K experts fire).

**Batch efficiency**: Expert routing must distribute tokens across experts. With small batches, some experts may process very few tokens, wasting their allocated compute. Large batches even out utilization.

## Load Balancing

A naive gating network sends most tokens to a few popular experts (expert collapse), leaving others idle and wasting capacity. Training fix: add an **auxiliary load-balancing loss**:

```python
# Simplified load-balance loss (added to main task loss during training)
# f_i = fraction of tokens routed to expert i
# P_i = mean gating score for expert i across the batch

load_balance_loss = N_experts * sum(f_i * P_i for i in range(N_experts))
total_loss = task_loss + alpha * load_balance_loss   # alpha ≈ 0.01
```

This penalizes uneven routing and forces the gating network to use all experts roughly equally.

## Practical Implications for API Users

If you're calling Claude, GPT-4, or Gemini, you're almost certainly talking to a MoE model. Key takeaways:

- **Effective capacity >> compute cost**: you're getting outputs informed by a massive parameter count at the inference cost of a much smaller active count
- **Expert specialization is real**: different experts develop functional specializations (code, math, specific languages). Prompt quality matters because it determines which experts get activated
- **[Quantization](/guides/quantization) is harder**: per-expert calibration produces better results than global calibration, because different experts have different weight distributions. Tools like AWQ and GPTQ now support expert-aware quantization
