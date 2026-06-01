
Tokenization in [[AI]], particularly in [[Natural Language Processing (NLP)]], is the process of taking a block of text and breaking it down into smaller, usable chunks named "tokens". Generally in English 1 token is equal to about 4 words. However, based on the tokenization model, there are multiple ways to go about this.


### **Why does it matter?**

1) Model input -> AI models **operate on tokens**, so understanding token counts would help manage input constraints or size limits
2) Cost estimation -> APIs charge based on token usage, not word limit
3) Performance -> Efficient tokenization ensures much better [[Context]] handling and reduces processing overhead


### **Types of tokenization**

1) Word-level -> Splits text into words (very uncommon in modern LLMs)
2) Subword-level -> Breaks words into smaller units (used in GPT)
3) Character-level -> Splits into individual characters (useful for certain languages, like Chinese)


### **Considerations**

1) Different models have different tokenization rules and architectures
2) Non-English languages and/or special characters may produce much more tokens than expected