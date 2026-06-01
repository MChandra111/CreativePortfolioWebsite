
Context is the background information or situational awareness that an [[AI]] intakes to produce accurate results.

This is commonly done by simply sending the entire chat-log every single time, increasing [token](Tokenization) usage on each subsequent query.

Includes factors like user history, environment, time, cultural nuances, and emotional tone.

### **Types of AI Context**

Linguistic Context -> Understanding the meaning of words based on surrounding text. Lets the AI detect sarcasm or tone

Situational Context -> Considers the user's environment or activity. Reduces ambiguity

Temporal Context -> Involves time-based understanding, distinguishing between "today" and "next week"

---
## **Context Windows**

[[Agent Memory]]

Defines how much Context, or information, an LLM can keep in its short-term memory. This is measured in Tokens, and as the limit is reached, old tokens are dropped for new ones.

### **Core factors**

Tokenization Efficiency -> Fewer tokens per sentence = more context in the same window

Attention Mechanism -> Self-attention scales quadratically with window size, making very large contexts computationally expensive

Positional Encoding -> Methods like RoPE and ALiBi exist to enable more stable long-sequence handling compared to absolute [[Embeddings]]


### **Trade-offs**

Large Windows
Pros:
- Better long-range reasoning
- Full document analysis
- Multimodal context
Cons:
- Computational very expensive
- Lost in the middle (forgetting middle content)

Mid-range Windows
Pros:
- Efficient
- Can still handle long documents
Cons:
- Requires structured inputs for large tasks

Small Windows + [[Retrieval-Augmented Generation (RAG)]]
Pros:
- Cost-effective
- RAG systems only feed relevant chunks
- Future-proof
Cons:
- Higher maintenance (RAG documents must be maintained)
- More initial setup

### **Optimization Strategies**

[[Retrieval-Augmented Generation (RAG)]]

Context Engineering -> Prioritize and reorder critical information

[[Chunking]] methods -> Semantic chunking is helpful (splits at natural boundaries)

Model selection -> Match window size tot ask complexity