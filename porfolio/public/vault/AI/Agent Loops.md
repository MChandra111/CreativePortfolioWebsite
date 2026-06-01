
The key loop that allows [[AI]] Agents to perform multi-step, adaptive tasks.

Chatbots process a single input and produce a single output, while an [[Agentic AI]] would **perceive, reason, plan, act, and observe.**

This is the fundamental loop:
### **Perceive**
Gather input from anywhere, not just the user.

Examples: user input, API result, error, prior action output

### **Reason**
Use the initial LLM to decode the input and decide what to do next. [[Context]] matters a lot here.

Examples: "The user wants me to build a "skobbledygoop". Let me look that up!"

### **Plan**
This part is optional but is often necessary just because agentic AI systems are **unnecessary for simple tasks**. The LLM breaks down the complex goals into subtasks with steps.

### **Act**
Make the API call, Execute a [[Tool Call]], or do another operation

### **Observe**
Evaluate the result and decide whether to continue, backtrack, or stop.
Knowing when to stop is one of THE MOST important things for an [[Agentic AI]].


[[Multi-Agent Systems]] refer to this as Perceive -> Reason -> Act -> Communicate -> Coordinate -> (Act) -> (Observe)

You use these specifically when you have unpredictable, multi-step workflows. It's important to know what you're doing because [[Multi-Agent Systems]] can consume up to **15x** as many tokens as a normal chatbot.

Observability - We use [[LangSmith]] for Tracing in ApplyDev. This tracks **each agent** across the multi-agent setup to show each reasoning step, tool call, and result for debugging and/or auditing.

Stop conditions - Prevent infinite loops with iteration caps & progress checks <-- **Very important**.