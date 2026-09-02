A voice agent processes spoken input and responds with synthesized speech in a continuous, low-latency loop. Unlike chat interfaces, voice requires: streaming audio input → streaming ASR → LLM response → streaming TTS → audio output — with latencies measured in milliseconds, not seconds.

## Two Architectures

**Cascade (ASR → LLM → TTS)**: separate models for each stage, connected via streaming:

```python
import anthropic
from deepgram import DeepgramClient, LiveTranscriptionEvents, LiveOptions
import elevenlabs as el
import asyncio, queue

client = anthropic.Anthropic()
deepgram = DeepgramClient()

async def cascade_voice_agent():
    audio_queue = queue.Queue()
    transcript_buffer = ""

    # Streaming ASR
    dg_connection = deepgram.listen.live.v("1")

    def on_transcript(_, result, **kwargs):
        nonlocal transcript_buffer
        sentence = result.channel.alternatives[0].transcript
        if result.is_final and sentence:
            transcript_buffer += sentence + " "
            # Trigger LLM when we detect end of user utterance
            process_utterance(transcript_buffer.strip())
            transcript_buffer = ""

    dg_connection.on(LiveTranscriptionEvents.Transcript, on_transcript)
    dg_connection.start(LiveOptions(model="nova-2", language="en-US"))

    def process_utterance(text: str):
        # Stream LLM response → stream TTS
        response_text = ""
        with client.messages.stream(
            model="claude-haiku-4-5-20251001",    # Use fast model for low latency
            max_tokens=256,
            messages=[{"role": "user", "content": text}]
        ) as stream:
            for chunk in stream.text_stream:
                response_text += chunk
                # Feed to TTS as sentences complete for lowest latency
                if chunk.endswith(('.', '!', '?', ':')):
                    speak(response_text)
                    response_text = ""
            if response_text:
                speak(response_text)

    def speak(text: str):
        audio = el.generate(text=text, voice="Rachel", model="eleven_turbo_v2")
        el.play(audio)

# Full-duplex audio processing — continue while speaking and listening
```

**Native Real-Time API (WebRTC)**: a single model handles audio end-to-end, enabling natural interruptions, emotional prosody, and sub-300ms latency. OpenAI's Realtime API and emerging Anthropic streaming capabilities use this approach.

## Latency Budget

For conversational voice, total latency (speech end → first audio byte) should be < 500ms:

| Stage | Target | Notes |
|-------|--------|-------|
| ASR (speech → text) | 100–200ms | Streaming ASR starts before utterance ends |
| LLM TTFT | 100–200ms | Use Haiku or Flash; streaming |
| TTS first audio | 50–100ms | Stream first sentence immediately |
| **Total** | **< 500ms** | Above this, conversation feels unnatural |

## Turn Detection

Detecting when the user has finished speaking is the hardest sub-problem:

```python
import numpy as np

class EndpointDetector:
    """Simple energy-based voice activity detection (VAD)."""
    def __init__(self, silence_threshold=0.01, silence_frames=20):
        self.silence_threshold = silence_threshold
        self.silence_frames = silence_frames
        self.silence_count = 0
        self.is_speaking = False

    def process_frame(self, audio_frame: np.ndarray) -> bool:
        """Returns True when end of utterance detected."""
        energy = np.sqrt(np.mean(audio_frame ** 2))

        if energy > self.silence_threshold:
            self.is_speaking = True
            self.silence_count = 0
        elif self.is_speaking:
            self.silence_count += 1
            if self.silence_count >= self.silence_frames:
                self.is_speaking = False
                return True  # End of utterance
        return False
```

Production VAD: use Silero VAD (transformer-based, 10ms inference) or WebRTC's built-in VAD for accurate end-of-utterance detection across different speakers and noise conditions.

## Interruption Handling

Users naturally interrupt voice agents. Graceful interruption requires:
1. **Detect barge-in**: user starts speaking while agent is speaking
2. **Stop TTS immediately**: cancel queued audio
3. **Discard in-flight LLM response**: don't speak the rest of the previous reply
4. **Process new input**: treat the interruption as a new utterance

Most production voice stacks (LiveKit Agents, Vapi, Retell) handle this automatically. Building custom interruption handling requires WebRTC-level audio control.

## Production Stack

| Component | Options |
|-----------|---------|
| Real-time audio transport | LiveKit, Daily, Twilio Media Streams |
| ASR | Deepgram Nova-2, AssemblyAI Universal, Whisper (self-hosted) |
| LLM | Claude Haiku (lowest latency), claude-sonnet-4-6 (higher quality) |
| TTS | ElevenLabs Turbo v2 (~100ms), Cartesia Sonic, Play.ht |
| Orchestration | LiveKit Agents, Vapi, Retell AI (managed platform) |
