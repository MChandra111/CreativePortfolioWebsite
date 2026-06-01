
RAG is the process of optimizing the output of an LLM so that it references an authoritative knowledge base outside of its training data source. At a baseline, this can help reduce hallucinations, improve accuracy, and reduce overhead. RAG is used to domain-match LLMs that are previously trained on billions of parameters of data without needing to retrain the model.

In more plain terms, here is the pipeline:

1) A user submits a query
2) Before sending to the LLM, RAG adds the "handy dandy documents" relating to the query. This can be done through [[Tokenization]] and [[Chunking]]
3) The LLM produces a much better output thanks to the documents
4) External data must be updated to keep the LLM up to date
### **Benefits**

1) Cost-effective implementation
2) Current information -> LLMs are date-locked to the past and RAG helps bring them up to speed. RAG can connect DIRECTLY to live social media feeds, news sites, etc.
3) Enhanced user trust
4) More developer control

**What is the difference between Semantic search and RAG?**

Semantic search allows the query to be mapped to the relevant documents rather than just pulling every piece of information in the database

Conventional/keyword search solutions produce limited results, and developers must deal with word [[Embeddings]], documenting [[Chunking]], and other complexities. Semantic search technologies, on the other hand, do all the work of 