
Top-P is also known as **Nucleus Sampling**.

You take all the candidate tokens in **descending order** of probability, and keep the smallest prefix whose probabilities sum to `p`. Everything outside that **nucleus** is dropped to **Zero Probability**.

The legal range is 0 to 1:

`top-p = 1` -> No filtering. Whole distribution in scope. Still subject to whatever temperature has done.

`top-p = 0.9` -> Drop the long tail. The bottom 10% of cumulative probability mass cannot be sampled. Common default.

`top-p = 0.1` -> Aggressive filtering. only the very top of the distribution is in scope. Behavior approaches greedy.

Top-P is **adaptive**. Confident models have much smaller **nuclei**, and uncertain models have much bigger ones. Top-P has replaced Top-K as the default truncation method specifically for this adaptability.

Top-P also interacts with temperature, as temperature reshapes the distribution BEFORE softmax is applied, the top-p truncates the **reshaped distribution**. 