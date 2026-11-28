# Security Policy

## Supported Versions

Security updates are applied to the latest state of the `main` branch and active production deployments.

| Component | Supported |
| --- | --- |
| Website Frontend (`frontend/`) | Yes |
| CRM Application (`crm/`) | Yes |
| Laravel CMS Backend (`laravel/`) | Yes |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report vulnerabilities privately using GitHub Private Vulnerability Reporting:

1. Go to [Security Advisories](https://github.com/imashishraghav/get-into-feed-client/security/advisories/new).
2. Provide a clear description of the issue, affected component(s), steps to reproduce, and potential impact.
3. Include any proof-of-concept or suggested remediation if available.

### What to Expect

- **Acknowledgment:** Within 48 hours of receiving your report.
- **Triage & Updates:** Regular status updates while we validate and prepare a fix.
- **Disclosure:** Once a fix is deployed, we will coordinate responsible disclosure if applicable.

## Hardening & Deployment Notes

For Hostinger production hardening and environment security guidelines for the Laravel CMS, see [`laravel/SECURITY.md`](../laravel/SECURITY.md).
