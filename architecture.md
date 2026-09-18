# Technical Architecture

## Recommended architecture
Frontend SPA/SSR application + REST API + relational database + object storage + transactional email/WhatsApp integration + analytics.

## Logical components
- Web frontend
- API
- Authentication/authorization
- Lead service
- Content/project service
- Notification service
- Media storage
- Database
- Analytics

## Suggested implementation
Frontend:
- Angular or equivalent modern framework
- Component-driven UI
- Route-level lazy loading
- Environment-based configuration

Backend:
- Java Spring Boot or equivalent
- RESTful APIs
- Validation at API boundary
- Service/repository separation

Database:
- PostgreSQL recommended

Storage:
- S3-compatible object storage for project media and enquiry attachments.

## Security boundaries
Public:
- Read published content
- Submit enquiry

Authenticated:
- Manage leads/content/configuration

Admin-only:
- Change contact identity
- Publish content
- Manage users/roles

## Configuration rule
No business-critical contact identity should be duplicated across frontend components, backend controllers, templates, or static HTML.

Single source:
`config/business.yaml` → environment/build/runtime configuration → UI/API.

## Reliability
- API timeouts.
- Retry only idempotent operations.
- Idempotency key for enquiry submission.
- Structured logging.
- Health endpoint.
- Error monitoring.
