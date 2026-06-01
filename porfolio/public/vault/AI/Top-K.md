
Top-K keeps only the `k` highest-probability tokens and zeros out the rest. unlike Top-P it does not adapt to the confidence of the model. Very deterministic and maladaptive.

`top-k = 1` -> Greedy

`top-k = 50` -> A common open-weights default.

`top-k = 0` or unset -> no filtering on count

The case for Top-K over Top-P is that it is simpler to reason about. You always know exactly how many candidates are inthe pool.

The case against Top-K is that when model distribution is highly skewed, Top-K can include tokens with vanishingly small probability that are essentially **noise**. When it' flat, Top-K can cut off useful candidates.