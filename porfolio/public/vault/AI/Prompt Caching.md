
Prompt Caching is a form of performance optimization that reduces latency and cost when working with large, repetitive prompts in [[AI]] models. Most commonly [[Large Language Models (LLMs)]].

It stores the **prefix** of a prompt (static instructions, examples, tools, etc.) so that repeated requests with the same prefix can skip reprocessing and used **cached computations**.

### **How it works**

1) Automatic Activation for prompts >= 1024 tokens on supported models
2) The system hashes the first ~256 tokens of the prompt to route requests to a cache
3) Cache hit -> The model reuses stored key/value tensors from the attention layers, cutting latency up to 80% and input costs up to 90%
4) Cache miss -> The prompt is processed normally, and its prefix is cached for future use

### **Retention policies**

In-Memory (default) -> Keeps cached prefixes for 5-10 minutes of inactivity

Extended (24h) -> Available on select models. Stores tensors in GPU-local storage for up to 24 hours

### **Best practices**

1) Put static content first -> Place instructions, examples, and tools at the start; dynamic user data at the end
2) Avoid overflow -> Keep identical prefix + key combinations under ~15 requests/minute to prevent cache dilution
3) Monitor performance -> Track `cached_tokens` in API responses to measure efficiency

### **Key Notes**

1) No extra cost; works automatically
2) Does not alter model outputs, just speeds up prompt processing
3) In-memory caching supports **Zero Data Retention**, extended caching does not