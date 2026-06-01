
[[AI]] Agent Memory is necessary to turn the agents from stateless responders into context-aware assistants. Modern systems have both Long-Term and Short-Term memory. Short-term memory maintains [[Context]] within the session alone. Long-Term memory persists across sessions, enabling agents to recall user preferences, past issues, etc.

### **In-Context Memory**

Loads all relevant information directly into the agent's active context window for immediate use.

Pros:
1) Fast and Zero-latency retrieval
2) Simple to implement

Cons:
1) Token costs scale linearly - large windows = higher costs
2) Accuracy degrades as context grows (attention weakens)
3) Ephemeral - context is cleared after each call, so no persistence across sessions

Use Case: Quick, Low-Cost, Short-Term
### **External Memory**

Stores information persistently outside the context window. Examples include a [[Vector Databases]], graph store, or memory library. Retrieves only what's needed

Pros:
1) Persistent - retains across sessions
2) Lower token usage - 90% fewer tokens than full-context
3) Better accuracy - 26% improvement in retrieval quality (targeted retrieval)
4) Semantic (facts/knowledge) and Episodic (event history) memory

Cons:
1) Requires setup & maintenance of the persistence storage
2) Retrieval may have small latency compared to in-context

Use Case: Long-Term, Multi-Session, Enterprise-Grade