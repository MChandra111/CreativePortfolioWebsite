
26/89 ✅

**Agentic AI & Orchestration** ✅
- [[Agentic AI]] (the paradigm itself)
- [[Agent Loops]] loops (observe → think → act)
- [[Multi-Agent Systems]]
- [[Agent Orchestration]]
- [[LangGraph]] (state machines for agents)
- [[LangChain]] (vs LangGraph — know the difference)
- [[State Machines]]
- [[Directed Acyclic Graphs (DAGs)]]
- [[Parallel vs Sequential Agent Execution]]
- [[Agent Memory]] (in-context vs external)
- [[Tool Call]]ing / function calling
- [[ReAct Prompting]] pattern (Reason + Act)
- [[Human-In-The-Loop (HITL)]] agents
- [[Agent Observability]] / tracing

---

**LLMs & Prompting** ✅
- [[Large Language Models (LLMs)]] (how they work at a high level)
- [[Tokenization]]
- [[Context]] windows
- [[Temperature]]
- [[Sampling]]
- [[System Prompts vs User Prompts]]
- [[Prompt Engineering]]
- [[Hallucination]] — causes and mitigation
- [[LLM-as-a-Judge]] (eval pattern)
- [[Prompt Caching]]
- [[Streaming Responses]] (SSE / token streaming)
- [[Model families and their tradeoffs]] — Claude, Llama, Gemini, and their tradeoffs

---

**RAG & Vector Search**

- [[Retrieval-Augmented Generation (RAG)]]
- Vector embeddings
- Embedding models (sentence-transformers, `all-MiniLM-L6-v2`)
- Cosine similarity
- Approximate nearest neighbor search (ANN)
- Chunking strategies (fixed-size, semantic, recursive)
- Chunk overlap
- Document ingestion pipelines
- Hybrid search (vector + keyword/BM25)
- Reranking
- Chroma (local vector DB)
- Pinecone (managed vector DB — know conceptually)
- Namespace / index design in vector DBs

---

**Backend & APIs**

- FastAPI
- REST APIs
- Async programming in Python (`async`/`await`)
- Background tasks
- Server-Sent Events (SSE)
- WebSockets (vs SSE — know the difference)
- Environment variables & secrets management
- Pydantic (data validation, used heavily in FastAPI)
- API rate limiting
- Error handling patterns

---

**Frontend**

- React (component model, hooks)
- TypeScript basics
- `useState` / `useReducer` for streaming state
- `EventSource` API (consuming SSE in the browser)
- Tailwind CSS
- Single-page application (SPA) architecture

---

**Data & ML Foundations**

- Supervised vs unsupervised learning (context for your ML agents)
- Fine-tuning vs RAG (the fundamental tradeoff)
- NLP basics — tokenization, named entity recognition, semantic similarity
- TF-IDF / BM25 (keyword search — contrast with vector search)
- Precision vs recall (relevant for eval design)
- Model quantization (you used this at Aerobotics7 — worth a formal note)
- Pruning (same reason)

---

**Evals & Observability**

- Eval harnesses
- LLM-as-judge pattern
- Unit tests vs evals — when to use each
- LangSmith (tracing and eval tooling)
- Logging levels (DEBUG, INFO, ERROR)
- Observability vs monitoring (know the distinction)
- Metrics — latency, throughput, token cost per run

---

**DevOps & Deployment**

- Docker (containers, images, Dockerfile)
- Multi-stage Docker builds
- Docker Compose
- Monorepo structure
- CI/CD concepts
- AWS Lambda (serverless compute)
- AWS S3 (static hosting)
- AWS API Gateway
- AWS CloudFront (CDN)
- AWS ECR (container registry)
- Infrastructure as Code (IaC) — conceptual awareness
- Environment parity (dev vs prod)

---

**Software Engineering Fundamentals**

- Type hints in Python
- Docstrings and code documentation
- Design patterns — factory, strategy (relevant to swappable LLM providers)
- Dependency injection (how your `config.py` works)
- Separation of concerns
- REST vs GraphQL (know the difference conceptually)
- Git / version control best practices
- `.env` files and the 12-factor app methodology

---

**Adjacent Concepts Worth a Note**

- MCP (Model Context Protocol) — the emerging standard for agent tool integration
- Agentic frameworks comparison — LangGraph vs CrewAI vs AutoGen
- OpenAI function calling spec (the standard tool calling format most providers follow)
- Context length vs RAG (the ongoing debate about whether long context windows reduce the need for RAG)
- Prompt injection attacks (security concept relevant to your cybersecurity minor)
- AI agent guardrails / safety
- Cost optimization patterns — prompt caching, batch processing, model routing