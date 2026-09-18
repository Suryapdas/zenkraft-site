# Security & Privacy Specification

## Threat model
Protect:
- Lead PII
- Uploaded documents
- Admin credentials
- Contact configuration
- CMS content integrity

## Controls
- HTTPS only in production.
- Secure authentication with MFA recommended for admins.
- RBAC.
- Server-side validation.
- Rate limiting on public forms.
- CSRF protection where applicable.
- Secure HTTP headers.
- Content Security Policy.
- File type/size validation.
- Malware scanning for uploads where available.
- Encrypt sensitive data at rest where supported.
- Secrets only through environment/secret manager.
- Never place API secrets in frontend code.

## Privacy
The enquiry form shall explain:
- Why personal data is collected.
- How it will be used.
- Retention/contact policy.
- How users can request deletion where applicable.

## Logging
Do not log:
- Passwords
- Authentication tokens
- Full uploaded documents
- Unnecessary PII

## Production gate
Production deployment is blocked if contact verification flags are false or required secrets are missing.
