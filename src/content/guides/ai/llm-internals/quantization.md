## Quantization

Quantization reduces the numerical precision of model weights to shrink GPU memory usage and speed up inference — at a small cost to output quality.

## Precision Types

| Format | Bits | Memory (7B model) | Notes |
|--------|------|-------------------|-------|
| FP32 | 32 | ~28 GB | Training precision; never used for inference |
| FP16 / BF16 | 16 | ~14 GB | Standard inference baseline |
| FP8 | 8 | ~7 GB | Native on H100/A100; near-lossless |
| INT8 | 8 | ~7 GB | Requires calibration; slightly lower quality than FP8 |
| INT4 | 4 | ~3.5 GB | Practical minimum; perplexity within ~6% of FP16 |
| INT2 | 2 | ~1.75 GB | Experimental; significant quality loss |

**BF16 is preferred over FP16.** BF16 has the same memory cost but better numeric range, making it the default for both training and serving in 2026.

## Methods

### bitsandbytes

The standard for fine-tuning with [QLoRA](/guides/lora-qlora). Two modes: LLM.int8() and 4-bit NF4.

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

# 4-bit NF4 — recommended for QLoRA fine-tuning
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",            # Normal Float 4: optimized for weight distributions
    bnb_4bit_compute_dtype=torch.bfloat16, # upcast to BF16 for matrix multiply
    bnb_4bit_use_double_quant=True,        # quantize the quantization constants too
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    quantization_config=bnb_config,
    device_map="auto",
)
```

**Best for:** QLoRA fine-tuning. Excellent quality (NF4 is designed to preserve the normal distribution of weight values). Not the fastest for pure inference compared to AWQ.

### GPTQ

Post-training quantization that minimizes quantization error layer by layer using the Hessian of the loss. Calibration data required (a few hundred prompts).

```bash
# Use pre-quantized GPTQ models from HuggingFace (common naming: model-4bit-GPTQ)
# Or quantize yourself:
pip install auto-gptq optimum

python -c "
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

quantize_config = BaseQuantizeConfig(bits=4, group_size=128, desc_act=False)
model = AutoGPTQForCausalLM.from_pretrained('meta-llama/Llama-3.1-8B', quantize_config)
model.quantize(calibration_examples)
model.save_quantized('./llama3-8b-gptq-4bit')
"
```

With the **Marlin CUDA kernel**, GPTQ achieves ~712 tok/s output throughput on H100 — faster than baseline FP16.

### AWQ (Activation-Aware Weight Quantization)

Identifies which weight channels have the most impact on activations and protects them with higher precision. No calibration dataset required — uses a small set of prompts automatically.

```python
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model = AutoAWQForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

quant_config = {
    "zero_point": True,
    "q_group_size": 128,
    "w_bit": 4,
    "version": "GEMM"   # or "Marlin" for maximum throughput
}
model.quantize(tokenizer, quant_config=quant_config)
model.save_quantized("./llama3-8b-awq-4bit")
```

With the **Marlin kernel**, AWQ achieves ~741 tok/s on H100 — the fastest option for production GPU serving and 10.9× faster than baseline FP16.

**Best for:** Production inference on NVIDIA GPUs. The top choice for serving in 2026 when using vLLM or SGLang.

### GGUF (llama.cpp format)

GGUF is a **file format**, not a quantization algorithm. It packages quantized weights and model metadata into a single portable file used by llama.cpp and Ollama.

```bash
# Download GGUF from HuggingFace (Bartowski and other maintainers publish many options)
# Q4_K_M = 4-bit, K-quant method, Medium quality — the recommended default
ollama pull llama3.1:8b-instruct-q4_K_M

# With llama.cpp directly
./llama-cli -m llama-3.1-8b-Q4_K_M.gguf -p "What is quantization?"

# Common GGUF naming:
# Q2_K    — very aggressive, avoid for production
# Q4_K_M  — best balance of quality and size (recommended)
# Q5_K_M  — better quality than Q4, ~20% larger
# Q8_0    — near-lossless, but almost as large as FP16
```

**Best for:** Local development, CPU inference, and edge deployment.

### FP8

Hardware-native 8-bit float. H100 and A100 GPUs have dedicated FP8 tensor cores. The fastest option on supported hardware with near-FP16 quality.

```python
from vllm import LLM
# vLLM automatically enables FP8 on H100/A100
llm = LLM(model="meta-llama/Llama-3.1-70B-Instruct", quantization="fp8")
```

## Decision Guide

```
What are you doing?
├── Fine-tuning with QLoRA                 → bitsandbytes 4-bit NF4
├── Serving on NVIDIA GPU (production)
│   ├── H100 / A100 available              → FP8 (fastest, near-lossless)
│   ├── A10G / L4 / other NVIDIA           → AWQ + Marlin kernel
│   └── No Marlin support                  → GPTQ
├── Local development / CPU                → GGUF Q4_K_M (Ollama)
└── Edge serving with quality priority     → GGUF Q5_K_M or Q8_0
```

## Quality Reference

All INT4 methods stay within ~6% of FP16 perplexity on standard benchmarks. For most production workloads the quality difference is imperceptible to end users. If quality is critical, use FP8 (nearly identical to FP16) or INT8 over INT4.
