
## **Sequential Execution**

Sequential Execution is the correct and viable approach when Step B requires the output of Step A to function correctly. There's no way around this.

Sequential bottlenecks occur when you have multiple calls or pieces of logic that do not depend on each other but are still running one after another. An example is 5 separate LLM queries that have no relation to each other. To get around this, we use **parallel execution**

## **Parallel Execution**

Multiple [[AI]] agents are running simultaneously, handling independent tasks at the same time.

##### **Fan-Out / Fan-In Architecture**

Fan-Out: A coordinator agent (or orchestrator) distributes tasks to multiple worker agents that run concurrently

Fan-In: Results from each worker are collected and aggregated once they all complete

A single orchestration layer manages the routing, and individual agents focus on their own assigned subtasks.

##### **Why it's complicated**

You need to:
1) Track which agents have completed
2) Handle failures in one branch without killing the whole workflow
3) Merge results in a consistent, usable way
4) Manage rate limits across multiple concurrent model calls