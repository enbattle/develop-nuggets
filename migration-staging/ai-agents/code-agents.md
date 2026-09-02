## Code Agents

A code agent generates code, executes it, observes the output (stdout, stderr, return values), and iterates. The execution environment becomes the model's feedback mechanism — it sees runtime errors, test failures, and function outputs directly, rather than reasoning about code behavior in the abstract.

## The Execute-Observe Loop

```python
import anthropic
import subprocess, tempfile, os

client = anthropic.Anthropic()

def execute_python(code: str) -> dict:
    """Run Python in an isolated subprocess and return stdout/stderr/exit code."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        f.flush()
        result = subprocess.run(
            ["python", f.name],
            capture_output=True, text=True, timeout=30
        )
    os.unlink(f.name)
    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "exit_code": result.returncode
    }

tools = [{
    "name": "execute_python",
    "description": "Execute Python code and return stdout, stderr, and exit code. Use this to test your solution iteratively.",
    "input_schema": {
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "Python code to execute"}
        },
        "required": ["code"]
    }
}]

def code_agent(task: str) -> str:
    messages = [{"role": "user", "content": task}]

    for _ in range(20):  # Max iterations
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            for block in response.content:
                if hasattr(block, 'text'):
                    return block.text
            return "Task completed"

        # Execute code and feed back results
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_python(block.input["code"])
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": f"stdout:\n{result['stdout']}\nstderr:\n{result['stderr']}\nexit_code: {result['exit_code']}"
                })

        messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached"

# Usage
result = code_agent("""
Write a function that finds all prime numbers up to N using the Sieve of Eratosthenes.
Test it with N=100 and verify the output includes 97 as the largest prime.
""")
```

## Sandboxing

Running LLM-generated code without isolation is a security risk. Use containerized sandboxes for any production deployment:

```python
import docker

client_docker = docker.from_env()

def execute_sandboxed(code: str, timeout: int = 30) -> dict:
    """Execute code in an isolated Docker container with resource limits."""
    container = client_docker.containers.run(
        "python:3.11-slim",
        command=["python", "-c", code],
        remove=True,
        mem_limit="128m",
        cpu_period=100000,
        cpu_quota=50000,     # 0.5 CPU
        network_disabled=True,
        read_only=True,
        stdout=True, stderr=True,
        detach=False,
        timeout=timeout
    )
    return {"output": container.decode(), "exit_code": 0}
```

## Production Code Agents

**Claude Code** (this CLI) is itself a code agent: it reads files, runs commands, sees output, and iterates. Other production code agents:

- **OpenHands (Devin-like)**: full software engineering agent with file editing, browser, terminal
- **Aider**: interactive code editing, feeds git diff to model context
- **SWE-agent**: state-of-the-art on SWE-bench, structured action-observation loop

## SWE-bench Performance (2025)

| Agent / Model | Resolved (%) |
|--------------|-------------|
| Amazon Q Developer | 54.6% |
| Claude 3.7 Sonnet (Agentless) | 49.0% |
| GPT-4o (OpenHands) | 38.0% |
| Llama 3.3 70B (Agentless) | 29.0% |

Tasks involve fixing real GitHub issues: reading issue descriptions, navigating codebases, writing patches, passing tests.

## Effective Code Agent Patterns

**Short feedback loops**: execute early and often. A 10-line script to validate your approach beats reasoning for 200 tokens.

**Explicit test-driven iteration**: write a failing test first, then implement until it passes. The test is the ground truth signal.

**Limit scope per iteration**: do one thing per execute call. Isolating sub-problems makes error messages diagnostic.
