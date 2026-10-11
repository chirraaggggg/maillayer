# Security policy

Please do not disclose security vulnerabilities in a public issue. Report
them privately through the repository's GitHub security advisory workflow.

Include the affected package and version, a minimal reproduction, impact, and
any suggested mitigation. Remove API keys, email addresses, message content,
and other secrets from reports.

MailLayer is a client library. Provider credentials are supplied by the
application developer and should remain server-side, be stored in a secret
manager or environment, and be rotated through the provider when exposure is
suspected.
