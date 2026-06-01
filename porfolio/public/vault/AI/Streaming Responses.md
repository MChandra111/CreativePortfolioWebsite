
Streaming is a process that allows [[AI]] systems to generate and display output as the response is **being computed**. Very useful in [[Agentic AI]] systems and [[Multi-Agent Systems]].

This makes the interaction feel smoother and more natural, akin to a real conversation.

### **How it works**

1) Token-by-Token Generation -> LLMs generate text **one token at a time**. When a user submits a query, the LLM starts generating tokens sequentially. As soon as the first token is generated it's sent to the client interface.
2) Streaming APIs -> Most LLMs support steaming through dedicated APIs.
	1) Step 1: **The client sends a query to the server with streaming enabled**
	2) Step 2: **The server processes the input and begins generating tokens**
	3) Step 3: **Tokens are sent to the client in small chunks, one by one, as they are ready**
	4) Step 4: **The client appends each chunk to the display in real-time**
3) Real-Time Client-side Rendering

### **Why it works**

1) Server-Sent Events (SSE) -> A protocol that allows servers to push updates to the client in real-time over a single HTTP connection. Each chunk of data is sent as a separate event.
2) WebSockets -> Provides a bi-directional communication channel between the client and the server, which is particularly useful for streaming. Less common in simple text streaming, but used in real-time applications like collaborative editors or live dashboards.
3) Asynchronous Programming -> Async programming frameworks like Python's `asyncio` or JavaScript's `Node.js` are essential for handling streaming efficiently.
	1) They let the server process multiple client requests concurrently
	2) They send tokens to clients without blocking the generation of subsequent tokens.