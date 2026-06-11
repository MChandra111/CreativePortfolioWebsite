Related: [[Cybersecurity]]

**Authentication, Authorization, and Accounting**

Identification
- This is who you claim to be
- Your username

Authentication
- Prove you are who you say you are
- Password and other authentication factors

Authorization
- Based on your identification and authentication, what access do you have?

Accounting
- Resources used: Login time, data sent and received, logout time

**Authentication**
People can enter passwords/usernames
Systems need **digital certificates**

An organization has a trusted Certificate Authority (CA)
- Most organizations maintain their own CAs
The organization creates a cert for the device, and digitally signs the cert with the organization's CA

**Authorization Models**

Once the user is authenticated:
- To what do they have access?

Users and services -> Data and applications
- Associating individual users to access rights does not scale

Put an authorization model in the middle
- Defined by Roles, Organizations, Attributes, etc.

