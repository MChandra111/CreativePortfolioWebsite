
Hallucination in [[AI]] models is talking mostly about cases of [[Large Language Models (LLMs)]] making up information, statistics, or past knowledge for a few different reasons.

#### **Types of Hallucinations**

Factual Hallucinations -> The model states incorrect facts, claims a false birth date or historical event, etc.

Logical Hallucinations -> Output contains illogical reasoning or internal contradictions.

Contextual or Intrinsic Hallucinations -> Generated content directly contradicts the source information provided.

Extrinsic Hallucination -> Model adds plausible-sounding details that are not present in the source material but cannot be immediately verified as false without external knowledge.

### **Causes of Hallucinations**

Next-Word Prediction Paradigm -> LLMs are trained to predict the next most probable word in a sequence. They are optimized for grammatical coherence and possibility, not for verifying truth.

Flawed or Incomplete Training Data -> Models learn from data scraped from the internet. The internet is inevitably inaccurate, biased, and outdated. Gaps in this data ("data voids") force the model to guess.

Misaligned Incentives in Training -> Standard model evaluations often prioritize accuracy because they are rewarded for correct guesses and penalized for abstentions. This means they would rather guess confidently than admit uncertainty.

Model Architecture and Decoding -> Technical aspects like the model's architecture and the "decoding strategy" can increase the likelihood of hallucinations.

### **How to Mitigate Hallucinations**

1) Implement [[Retrieval-Augmented Generation (RAG)]]
2) Add span-level verification to your RAG pipeline - Each claim is matched to a span of text
3) Fine-tune models on hallucination-focused datasets
4) Employ factuality-based re-ranking of multiple candidate responses
5) Integrate uncertainty calibration
6) Use structured [[Prompt Engineering]] like CoT
7) Lower the model's [[Temperature]] setting for factual tasks. Reduces randomness
8) Establish clear feedback loops for end-users to report errors
9) Implement robust output filters
10) Maintain rigorous human oversight for high-stakes domains