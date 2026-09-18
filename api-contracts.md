# API Contract Specification

Base path:
`/api/v1`

## Public endpoints

GET `/content/home`
GET `/services`
GET `/services/{slug}`
GET `/projects`
GET `/projects/{slug}`
GET `/contact`

POST `/leads`

### POST /leads request
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "projectType": "string",
  "budgetRange": "string",
  "timeline": "string",
  "description": "string",
  "preferredContactMethod": "PHONE|WHATSAPP|EMAIL",
  "consent": true,
  "source": "WEBSITE"
}
```

### Response
HTTP 201:
```json
{
  "leadId": "uuid",
  "status": "NEW",
  "message": "Your enquiry has been received."
}
```

## Admin endpoints

GET `/admin/leads`
GET `/admin/leads/{id}`
PATCH `/admin/leads/{id}`
POST `/admin/leads/{id}/notes`
GET `/admin/projects`
POST `/admin/projects`
PATCH `/admin/projects/{id}`
DELETE `/admin/projects/{id}`
GET `/admin/services`
POST `/admin/services`
PATCH `/admin/services/{id}`
GET `/admin/contact-config`
PATCH `/admin/contact-config`

## API rules
- Validate all inputs server-side.
- Return machine-readable error codes.
- Do not expose internal notes to public clients.
- Rate-limit public lead submission.
- Sanitize uploaded files.
- Require authorization for admin routes.
