Related: [[Cybersecurity]]

You can't deny what you've said. There's no taking it back

Sign a contract - Your signature adds non-repudiation.

A different perspective for [[Cryptography]]
- Proof of integrity
- Proof of origin, with high assurance of authenticity
---
### **Proof of integrity**

Verify data **does not change**
- The data remains accurate and consistent

In Cryptography, we use a **hash**
- Represent data as a short string of text
- Message digest, like a fingerprint
- If the data changes, the **hash** changes. If the person changes, you get a different fingerprint

Does not associate the data with **an individual**. Only tells you if the data has changed

---
### **Proof of origin**

Prove the **source** of the message. By makin sure the signature isn't fake, we provide Non-repudiation.

Signing with a **private key** - The message doesn't need to be encrypted, but nobody else can sign this.

Verify with **public key**. Asymmetrical encryption basics.

---
