# Requirement Traceability Matrix

| Requirement | UX | API | Data | Security | Acceptance |
|---|---|---|---|---|---|
| FR-001 | UX-Brand | Content | Site config | Integrity | AC-001 |
| FR-002 | Contact | GET /contact | SiteContactConfig | AC-002 | AC-001/002 |
| FR-003 | Homepage | content/home | Content | — | AC-013/014 |
| FR-004 | Services | /services | Service | Publish auth | AC-014 |
| FR-005 | Portfolio | /projects | Project/Media | Publish auth | AC-014 |
| FR-006 | Form | POST /leads | Lead | PII controls | AC-003/005 |
| FR-007 | Lead UX | admin/leads | Lead/Note | RBAC | AC-009/010 |
| FR-008 | Notifications | Lead service | — | Secrets | AC-006 |
| FR-009 | Confirmation | Lead response | — | — | AC-003 |
| FR-010 | WhatsApp | Config | SiteContactConfig | Verification | AC-007 |
| FR-011 | Map | Contact config | SiteContactConfig | Verification | AC-008 |
| FR-012 | Admin | Admin APIs | All CMS entities | RBAC | AC-009 |
| FR-013 | SEO | Content | Metadata | — | AC-014 |
| FR-014 | Analytics | Events | — | Privacy | — |
| FR-015 | Admin | Audit | AuditLog | Integrity | AC-010 |
