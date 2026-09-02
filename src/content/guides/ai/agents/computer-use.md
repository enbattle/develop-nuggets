GUI agents operate computers the way humans do: by observing a screen and sending keyboard/mouse events. Anthropic's computer use API gives Claude the ability to take screenshots, click, type, and scroll — acting as a user of any desktop or web application without needing an API or automation framework.

## The Computer Use Loop

```python
import anthropic
import subprocess, base64, time
from PIL import ImageGrab   # macOS/Linux: use scrot or pyautogui

client = anthropic.Anthropic()

def take_screenshot() -> str:
    """Capture screen and return base64-encoded PNG."""
    img = ImageGrab.grab()
    img.save("/tmp/screen.png")
    with open("/tmp/screen.png", "rb") as f:
        return base64.standard_b64encode(f.read()).decode()

def execute_action(action: dict) -> str:
    """Execute a computer_use action."""
    tool_type = action["type"]
    if tool_type == "screenshot":
        return take_screenshot()
    elif tool_type == "left_click":
        x, y = action["coordinate"]
        subprocess.run(["xdotool", "click", "--clearmodifiers", "1",
                        "--mousemove", str(x), str(y)])
    elif tool_type == "type":
        subprocess.run(["xdotool", "type", "--clearmodifiers", action["text"]])
    elif tool_type == "key":
        subprocess.run(["xdotool", "key", action["text"]])
    return take_screenshot()   # Return updated screenshot after action

tools = [{
    "type": "computer_20241022",
    "name": "computer",
    "display_width_px": 1920,
    "display_height_px": 1080
}]

def run_computer_agent(task: str) -> str:
    messages = [{"role": "user", "content": task}]
    screenshot = take_screenshot()

    while True:
        # Add current screen state
        messages[-1]["content"] = [
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot}},
            {"type": "text", "text": task if len(messages) == 1 else ""}
        ]

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # Add assistant response
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            return response.content[-1].text

        # Execute tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use" and block.name == "computer":
                screenshot = execute_action(block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": [{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot}}]
                })

        messages.append({"role": "user", "content": tool_results})
        time.sleep(0.5)  # Brief pause between actions
```

## Practical Limitations

Computer use is capable but slower and less reliable than purpose-built automation. Token consumption is high (each screenshot is ~1K–3K tokens).

| Task type | Reliability | Notes |
|-----------|------------|-------|
| Web navigation (clear UI) | High | Best use case |
| Form filling | High | Works well with explicit field labels |
| Desktop apps | Medium | Varies with UI complexity |
| Pixel-precise tasks | Low | Use if no API exists |
| Captchas, moving targets | Low | By design difficult |

## When to Use GUI Agents vs. APIs

GUI agents are the **last resort** tool when no programmatic interface exists:

```
First choice:   Official API
Second choice:  Web scraping / HTML parsing
Third choice:   GUI automation (Playwright, Selenium) without vision
Last resort:    Claude computer use (vision-based GUI agent)
```

Use computer use for: legacy enterprise apps with no API, one-off automation tasks where building a custom integration is not worth the cost, or demos where the visual interaction itself is the point.

## Available Actions

| Action | Description |
|--------|-------------|
| `screenshot` | Capture current screen state |
| `left_click` / `right_click` / `double_click` | Mouse clicks at (x, y) |
| `left_click_drag` | Click and drag from one coordinate to another |
| `type` | Type a string (keyboard input) |
| `key` | Press keyboard shortcuts (e.g., "ctrl+c", "Return") |
| `scroll` | Scroll at position with direction and amount |
| `cursor_position` | Return current cursor coordinates |
