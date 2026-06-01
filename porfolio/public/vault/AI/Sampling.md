
A [[Large Language Models (LLMs)]] takes an input token. When it needs to produce the next token, it produces a vector of unnormalized scores. These are called [[Logits]]. 

There is **one score per token in its vocabulary**. This can be hundreds of thousands of tokens.

A **Softmax** function transformers these into a probability distribution over the entire vocabulary, and generating the next token means picking one token from the distribution.

### **Greedy Decoding**

This method always picks the highest-probability token. While simple, it is deterministic and quite boring. It also leads to tie-breaking issues where it commits to one on a whim rather than exploring the other path. This leads to easily-avoidable issues.

**Sampling is the alternative**.

Rather than always picking the top token, we sample from the distribution proportionally. Since this is too random for most cases, modern APIs reshape the distribution before sampling.

Examples include:
![[Temperature]]



![[Top-P]]



![[Top-K]]

Stop sequences, max tokens, and seed control the loop and the randomness source.