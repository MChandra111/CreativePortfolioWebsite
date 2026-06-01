
A scalar that divides the logits **before the softmax**.

If `T` = Temperature and `z_i` = the logit for token `i`, the sampler computes the probability as:
`Softmax(z_i / T)`

`T = 1` -> Pass-through. The model's native distribution is what gets sampled.

`T < 1` -> Distribution sharpens. High-probability tokens get more of the mass, low probability tokens get less. As `T -> 0` the distribution collapses onto the top token. It's a limit function.

`T > 1` -> Distribution flattens. The top token loses some of its lead, and lower-ranked tokens become more likely. As `T -> ∞` , the distribution approaches uniform over **the entire vocabulary**.

Most APIs expose the Temperature from 0 to 2.

#### **Few mathematical points to note**

`T = 0` is not perfectly deterministic. It is ***mostly*** deterministic, not guaranteed.

`T > ~1.2` tends to degrade output quality fast for MOST models. It starts including tokens that are syntactically wrong, hallucinated, or just off-topic.

Temperature does NOT unlock new ideas. The model's vocabulary and its conditional probabilities do not change.