A non-streaming LLM call blocks until the entire response is generated, then sends all tokens at once. For a 500-token response at 50 tok/s, that's a 10-second wait before the user sees anything. Streaming sends tokens as they're generated, giving users immediate feedback and enabling progressive rendering.

## Server-Sent Events (SSE)

Anthropic's streaming API uses SSE: the server keeps the HTTP connection open and pushes newline-delimited JSON events as tokens are generated.

```python
import anthropic

client = anthropic.Anthropic()

# Method 1: Manual SSE consumption
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum entanglement"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)   # Progressive output

# Method 2: Event-by-event for full control
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum entanglement"}]
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="", flush=True)
        elif event.type == "message_delta":
            print(f"\nStop reason: {event.delta.stop_reason}")
        elif event.type == "message_stop":
            usage = stream.get_final_message().usage
            print(f"Tokens: {usage.input_tokens} in, {usage.output_tokens} out")
```

## FastAPI Streaming Endpoint

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import anthropic, json

app = FastAPI()
client = anthropic.Anthropic()

@app.post("/chat/stream")
async def stream_chat(request: dict):
    async def generate():
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=request["messages"]
        ) as stream:
            for text in stream.text_stream:
                # SSE format: "data: {...}\n\n"
                yield f"data: {json.dumps({'text': text})}\n\n"

            # Send final usage stats
            final = stream.get_final_message()
            yield f"data: {json.dumps({'done': True, 'usage': {'input': final.usage.input_tokens, 'output': final.usage.output_tokens}})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
```

## React Frontend: Consuming SSE

```typescript
async function streamChat(messages: Message[], onChunk: (text: string) => void) {
  const response = await fetch('/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split('\n\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = JSON.parse(line.slice(6));
      if (data.text) onChunk(data.text);
    }
  }
}
```

## Streaming Tool Use

When the model uses tools mid-stream, the stream pauses at the tool call, you execute the tool, then the stream resumes. This requires handling mixed content blocks:

```python
from anthropic import Anthropic
import anthropic

client = Anthropic()

def stream_with_tools(messages: list, tools: list) -> str:
    full_response = []

    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        tools=tools,
        messages=messages
    ) as stream:
        for event in stream:
            if hasattr(event, 'type'):
                if event.type == "content_block_delta" and hasattr(event.delta, 'text'):
                    print(event.delta.text, end="", flush=True)

    final = stream.get_final_message()

    if final.stop_reason == "tool_use":
        # Execute tool calls, then recurse with results
        tool_results = execute_tool_calls(final.content)
        messages.append({"role": "assistant", "content": final.content})
        messages.append({"role": "user", "content": tool_results})
        return stream_with_tools(messages, tools)

    return final.content[0].text
```

## Latency: Key Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| TTFT (Time to First Token) | Time from request to first token received | < 300ms for interactive |
| TBT (Time Between Tokens) | Interval between successive tokens | < 50ms for smooth rendering |
| Completion latency | Total time to last token | Depends on output length |

TTFT is the most user-perceptible latency for streaming UIs. Prompt caching, serving infrastructure location, and prompt complexity are the primary TTFT drivers.
