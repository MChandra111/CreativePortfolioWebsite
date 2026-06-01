
LLM-as-a-Judge is an **evaluation pattern** that uses a [[Large Language Models (LLMs)]] to evaluate the outputs of another LLM or [[AI]] system against a predefined rubric.

Rather than rely entirely on human evaluators, it scores responses for qualities like helpfulness, faithfulness, tone, and correctness.

### **How it works**

1) Rubric-based evaluation -> The judge LLM is prompted with a set of criteria, and rates the target model's output
2) Scalability -> Unlike human evaluation, which is slow and expensive, LLM judges can process thousands of examples quickly
3) [[Prompt Engineering]] -> The design of the judge's prompt is critical, as it directly affects reliability and alignment with human preferences.

### **Strengths**

1) Scalability
2) Speed
3) Explainability
4) Multilingual Potential

### **Limitations and Risks**

1) Bias and drift -> LLM judges face the same biases on their training data as any other LLM. The rubric prompt must be carefully maintained.
2) Inconsistent decision-making -> Prompt templates significantly affect performance, studies show mediocre alignment.
3) [[Hallucination]]s -> Judges can produce false positives
4) Task Dependency -> Reliability varies by domain

### **Best Practices**

1) Evaluate the Judge
2) Use explainable metrics (Tracing?)
3) Calibrate against humans
4) monitor drift
5) Hybrid approaches